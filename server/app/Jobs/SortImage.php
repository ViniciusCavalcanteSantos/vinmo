<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\Image;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SortImage implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(public Image $image, public Event $event)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $imageAnalyzerFactory = (new ImageAnalyzerFactory(app()));
            $imageAnalyzer = $imageAnalyzerFactory->make();

            $detections = $imageAnalyzer->findAllKnownFacesInPhoto($this->image->path);

            Log::info('all faces detected', $detections);
            // TODO: separar a foto usando uma tabela pivó
        } catch (\Exception $e) {
            Log::error('Job SortImage falhou: '.$e->getMessage(), [
                'image_id' => $this->image->id,
            ]);

            throw $e;
        }
    }
}
