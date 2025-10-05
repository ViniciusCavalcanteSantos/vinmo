<?php

namespace App\Services;

use BadMethodCallException;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\LazyCollection;
use Laravel\Scout\Builder;
use Laravel\Scout\Contracts\PaginatesEloquentModelsUsingDatabase;
use Laravel\Scout\Contracts\UpdatesIndexSettings;
use Laravel\Scout\Engines\Engine;

/**
 * Lightweight local DB-backed Scout engine intended as a fallback when Meilisearch
 * is not available. This version purposely keeps behavior simple: it stores a
 * denormalized `searchable_text` (concatenated string) and performs only
 * `LIKE "%term%"` searches on that column. No FULLTEXT or complex ranking.
 */
class LocalDatabaseEngine extends Engine implements UpdatesIndexSettings, PaginatesEloquentModelsUsingDatabase
{
    protected string $indexTable = 'scout_indices_simple';
    protected string $settingsTable = 'scout_index_settings';

    public function __construct()
    {
        // create a very small/simple index table if it doesn't exist
        if (!Schema::hasTable($this->indexTable)) {
            Schema::create($this->indexTable, function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('index_name')->index();
                $table->string('model_key')->index();
                $table->longText('searchable_text')->nullable();
                $table->json('payload')->nullable();
                $table->timestamps();
            });
        }

        if (!Schema::hasTable($this->settingsTable)) {
            Schema::create($this->settingsTable, function (Blueprint $table) {
                $table->bigIncrements('id');
                $table->string('index_name')->unique();
                $table->json('settings')->nullable();
                $table->timestamps();
            });
        }
    }

    /**
     * Upsert models into the local simple index.
     */
    public function update($models): void
    {
        if ($models->isEmpty()) {
            return;
        }

        $rows = [];

        foreach ($models as $model) {
            $data = $model->toSearchableArray();

            if (empty($data)) {
                continue;
            }

            $rows[] = [
                'index_name' => $model->searchableAs(),
                'model_key' => (string) $model->getScoutKey(),
                'searchable_text' => $this->makeSearchableText($data),
                'payload' => json_encode($this->normalizePayload($data)),
                'updated_at' => now(),
                'created_at' => now(),
            ];
        }

        if (!empty($rows)) {
            DB::table($this->indexTable)
                ->upsert($rows, ['index_name', 'model_key'], ['searchable_text', 'payload', 'updated_at']);
        }
    }

    protected function makeSearchableText(array $data): string
    {
        $values = array_map(function ($v) {
            if (is_array($v)) {
                return implode(' ', array_map('strval', array_flatten($v)));
            }
            return (string) $v;
        }, array_values($data));

        $text = implode(' ', array_filter($values));
        $text = mb_strtolower($text);
        $text = preg_replace('/\s+/', ' ', $text);

        return trim($text);
    }

    protected function normalizePayload(array $data): array
    {
        return array_map(function ($v) {
            if (is_array($v)) {
                return $v;
            }
            if (is_object($v)) {
                return (array) $v;
            }
            return $v;
        }, $data);
    }

    public function paginate(Builder $builder, $perPage, $page)
    {
        return $this->performSearch($builder, ['limit' => $perPage, 'page' => $page]);
    }

    protected function performSearch(Builder $builder, array $options = []): array
    {
        $indexName = $builder->index ?: $builder->model->searchableAs();
        $limit = $options['limit'] ?? ($builder->limit ?? 1000);
        $page = $options['page'] ?? null;

        $query = DB::table($this->indexTable)->where('index_name', $indexName);

        // basic support for simple where => match equality against fields stored in payload
        if (!empty($builder->wheres)) {
            foreach ($builder->wheres as $key => $value) {
                if ($key === '__soft_deleted') {
                    continue;
                }
                $jsonPath = "$.$key";
                if (is_null($value)) {
                    $query->whereRaw('JSON_EXTRACT(payload, ?) IS NULL', [$jsonPath]);
                } else {
                    $query->whereRaw('JSON_UNQUOTE(JSON_EXTRACT(payload, ?)) = ?', [$jsonPath, (string) $value]);
                }
            }
        }

        $term = trim(($builder->query ?? ''));

        if ($term === '') {
            $q = clone $query;
        } else {
            $like = "%$term%";
            $q = clone $query;
            $q->where('searchable_text', 'like', $like);
        }

        if (is_null($page ?? null)) {
            $q->limit($limit);
        } else {
            $q->limit($limit)->offset(($page - 1) * $limit);
        }
        $rows = $q->get()->all();

        // build hits
        $scoutKey = $builder->model->getScoutKeyName();
        $hits = collect($rows)->map(function ($row) use ($scoutKey) {
            $payload = is_string($row->payload) ? json_decode($row->payload, true) : ($row->payload ?? []);
            $hit = is_array($payload) ? $payload : [];
            $hit[$scoutKey] = $row->model_key;
            $hit['_scout_index_id'] = $row->id;
            return $hit;
        })->values()->all();

        return [
            'hits' => $hits,
            'totalHits' => count($hits),
        ];
    }

    public function map(Builder $builder, $results, $model)
    {
        if (empty($results) || empty($results['hits'])) {
            return $model->newCollection();
        }

        $objectIds = collect($results['hits'])->pluck($model->getScoutKeyName())->values()->all();
        $objectIdPositions = array_flip($objectIds);

        return $model->getScoutModelsByIds($builder, $objectIds)
            ->filter(fn($m) => in_array($m->getScoutKey(), $objectIds))
            ->map(function ($m) use ($results, $objectIdPositions) {
                $result = $results['hits'][$objectIdPositions[$m->getScoutKey()]] ?? [];
                foreach ($result as $key => $value) {
                    if (str_starts_with($key, '_')) {
                        $m->withScoutMetadata($key, $value);
                    }
                }
                return $m;
            })->sortBy(fn($m) => $objectIdPositions[$m->getScoutKey()])->values();
    }

    public function mapIds($results): Collection
    {
        if (empty($results['hits'])) {
            return collect();
        }

        $hits = collect($results['hits']);
        $first = $hits->first();
        $key = key(array_slice((array) $first, 0, 1, true));

        return $hits->pluck($key)->values();
    }

    public function keys(Builder $builder)
    {
        return $this->mapIdsFrom($this->search($builder), $builder->model->getScoutKeyName());
    }

    public function mapIdsFrom($results, $key): Collection
    {
        return empty($results['hits']) ? collect() : collect($results['hits'])->pluck($key)->values();
    }

    /**
     * Search using simple LIKE on searchable_text.
     */
    public function search(Builder $builder)
    {
        return $this->performSearch($builder, ['limit' => $builder->limit]);
    }

    public function lazyMap(Builder $builder, $results, $model)
    {
        if (empty($results) || empty($results['hits'])) {
            return LazyCollection::make($model->newCollection());
        }

        $objectIds = collect($results['hits'])->pluck($model->getScoutKeyName())->values()->all();
        $objectIdPositions = array_flip($objectIds);

        return $model->queryScoutModelsByIds($builder, $objectIds)
            ->cursor()->filter(fn($m) => in_array($m->getScoutKey(), $objectIds))
            ->map(function ($m) use ($results, $objectIdPositions) {
                $result = $results['hits'][$objectIdPositions[$m->getScoutKey()]] ?? [];
                foreach ($result as $key => $value) {
                    if (str_starts_with($key, '_')) {
                        $m->withScoutMetadata($key, $value);
                    }
                }
                return $m;
            })->sortBy(fn($m) => $objectIdPositions[$m->getScoutKey()])->values();
    }

    public function getTotalCount($results)
    {
        return $results['totalHits'] ?? 0;
    }

    public function flush($model): void
    {
        DB::table($this->indexTable)->where('index_name', $model->searchableAs())->delete();
    }

    /**
     * Delete models from the index.
     */
    public function delete($models): void
    {
        if ($models->isEmpty()) {
            return;
        }

        $indexName = $models->first()->searchableAs();
        $keys = $models->map->getScoutKey()->values()->all();

        DB::table($this->indexTable)
            ->where('index_name', $indexName)
            ->whereIn('model_key', $keys)
            ->delete();
    }

    public function createIndex($name, array $options = []): true
    {
        DB::table($this->settingsTable)->updateOrInsert(
            ['index_name' => $name],
            ['settings' => json_encode($options), 'updated_at' => now(), 'created_at' => now()]
        );

        return true;
    }

    public function updateIndexSettings($name, array $settings = []): void
    {
        DB::table($this->settingsTable)
            ->updateOrInsert(['index_name' => $name],
                ['settings' => json_encode($settings), 'updated_at' => now(), 'created_at' => now()]);
    }

    public function deleteIndex($name)
    {
        return DB::table($this->indexTable)->where('index_name', $name)->delete();
    }

    public function deleteAllIndexes(): int
    {
        return DB::table($this->indexTable)->delete();
    }

    /**
     * Paginate the given search on the engine (LengthAwarePaginator).
     */
    public function paginateUsingDatabase(Builder $builder, $perPage, $pageName, $page): LengthAwarePaginator
    {
        $results = $this->performSearch($builder, ['limit' => $perPage, 'page' => $page]);
        $models = $this->map($builder, $results, $builder->model);
        $total = $results['totalHits'] ?? count($models);

        return new LengthAwarePaginator(
            $models,
            $total,
            $perPage,
            $page,
            ['path' => Paginator::resolveCurrentPath(), 'pageName' => $pageName]
        );
    }

    /**
     * Paginate using simple paginator.
     */
    public function simplePaginateUsingDatabase(Builder $builder, $perPage, $pageName, $page): Paginator
    {
        $results = $this->performSearch($builder, ['limit' => $perPage, 'page' => $page]);
        $models = $this->map($builder, $results, $builder->model);

        return new Paginator(
            $models,
            $perPage,
            $page,
            ['path' => Paginator::resolveCurrentPath(), 'pageName' => $pageName]
        );
    }

    /**
     * Add soft delete marker to filterable attributes for compatibility.
     */
    public function configureSoftDeleteFilter(array $settings = []): array
    {
        $settings['filterableAttributes'] = array_values(array_unique(array_merge(
            $settings['filterableAttributes'] ?? [],
            ['__soft_deleted']
        )));

        return $settings;
    }

    public function __call($method, $parameters)
    {
        throw new BadMethodCallException("Method $method does not exist on LocalDatabaseIndexEngine.");
    }

    protected function usesSoftDelete($model): bool
    {
        return in_array(SoftDeletes::class, class_uses_recursive($model));
    }
}
