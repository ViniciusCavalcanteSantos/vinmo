<?php

namespace App\Models;

use App\Jobs\DeleteStoragePaths;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasUlids;

    protected $fillable = [
        'id',
        'organization_id',
        'imageable_id',
        'imageable_type',
        'parent_id',
        'original_name',
        'disk',
        'path',
        'type',
        'size',
        'width',
        'height',
        'mime_type',
        'hash',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function (Image $image) {
            if ($image->parent_id && empty($image->organization_id)) {
                $image->organization_id = Image::find($image->parent_id)->organization_id;
            }
        });

        static::deleting(function (Image $image) {
            $paths = $image->allVersions()->pluck('path')->toArray();

            DeleteStoragePaths::dispatch($paths);
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function versions(): HasMany
    {
        return $this->hasMany(Image::class, 'parent_id');
    }

    public function allVersions()
    {
        return $this->versions()->get()->prepend($this);
    }

    public function metas(): HasMany
    {
        return $this->hasMany(ImageMeta::class);
    }

    public function original(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'parent_id');
    }

    public function scopeOriginals($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeVersions($query, string|array|Collection $version)
    {
        if (is_array($version) || $version instanceof Collection) {
            $query->whereIn('type', $version);
        } else {
            $query->where('type', $version);
        }

        return $query;
    }

    public function getUrlAttribute(): string
    {
        if (config('app.image_proxy')) {
            return route('images.show', ['image' => $this->id]);
        }

        return Storage::disk($this->disk)->url($this->path);
    }

    public function getVersion(string $type): ?self
    {
        return $this->versions->firstWhere('type', $type);
    }

    public function clientImageLinks(): HasMany
    {
        return $this->hasMany(FaceCrop::class);
    }

    public function getClientsOnOriginalImageAttribute()
    {
        $imageReference = $this->parent_id
            ? ($this->relationLoaded('original') ? $this->original : $this->original()->first())
            : $this;

        if ($imageReference->relationLoaded('clientsOnThisImage')) {
            return $imageReference->clientsOnThisImage;
        }

        return $imageReference->clientsOnThisImage()->get();
    }

    public function clientsOnThisImage()
    {
        return $this
            ->belongsToMany(Client::class, 'face_crop_matches')
            ->withPivot(['event_id', 'matched_by', 'confidence'])
            ->withTimestamps();
    }

    public function storeExif(?array $exif)
    {
        if (!$exif) {
            return;
        }

        $allowedSections = ['IFD0', 'EXIF', 'GPS'];
        $maxEntries = 100;
        $saved = 0;

        foreach ($exif as $section => $data) {
            if (!in_array($section, $allowedSections)) {
                continue;
            }

            foreach ($data as $key => $value) {
                if ($saved >= $maxEntries) {
                    break 2;
                }

                if (str_starts_with($key, 'UndefinedTag')) {
                    continue;
                }

                $val = is_array($value) ? json_encode($value) : (string) $value;

                if (strlen($val) > 2000) {
                    $val = substr($val, 0, 2000).'...';
                }

                ImageMeta::create([
                    'image_id' => $this->id,
                    'key' => $section.'.'.$key,
                    'value' => $val,
                ]);

                $saved++;
            }
        }
    }
}
