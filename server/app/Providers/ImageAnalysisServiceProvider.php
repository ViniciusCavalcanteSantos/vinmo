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
                'region' => config('filesystems.disks.s3.region'),
                'credentials' => [
                    'key' => config('filesystems.disks.s3.key'),
                    'secret' => config('filesystems.disks.s3.secret'),
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
