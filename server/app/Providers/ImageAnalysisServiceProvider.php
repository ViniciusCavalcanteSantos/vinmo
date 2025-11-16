<?php

namespace App\Providers;

use App\Services\ImageAnalysis\AwsRekognitionAnalyzer;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use Aws\Rekognition\RekognitionClient;
use Illuminate\Support\ServiceProvider;

class ImageAnalysisServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        $this->app->singleton(ImageAnalyzerFactory::class, function ($app) {
            return new ImageAnalyzerFactory($app);
        });

        $this->app->bind(AwsRekognitionAnalyzer::class, function ($app) {
            $client = new RekognitionClient([
                'version' => 'latest',
                'region' => config('rekognition.region'),
                'credentials' => [
                    'key' => config('rekognition.key'),
                    'secret' => config('rekognition.secret'),
                ]
            ]);

            return new AwsRekognitionAnalyzer($client);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
