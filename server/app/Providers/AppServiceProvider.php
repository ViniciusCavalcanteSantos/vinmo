<?php

namespace App\Providers;

use App\Services\LocalDatabaseEngine;
use Illuminate\Support\ServiceProvider;
use Laravel\Scout\EngineManager;
use Laravel\Scout\Engines\MeilisearchEngine;
use Meilisearch\Client as MeilisearchClient;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        resolve(EngineManager::class)->extend('meilisearch_with_fallback', function ($app) {
            if (!config('scout.meilisearch.host') || !config('scout.meilisearch.key')) {
                return new LocalDatabaseEngine();
            }

            return new MeilisearchEngine(
                $app->make(MeilisearchClient::class, [
                    'url' => config('scout.meilisearch.host'),
                    'apiKey' => config('scout.meilisearch.key')
                ])
            );
        });
    }
}
