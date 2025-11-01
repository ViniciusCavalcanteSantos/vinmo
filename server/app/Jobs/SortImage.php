<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\FaceDetection;
use App\Models\Image;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
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
            $detections = collect($detections);

            $clientsInEvent = $this->event->clients()->pluck('clients.id')->toBase();

            DB::transaction(function () use ($detections, $clientsInEvent) {
                foreach ($detections as $detection) {
                    $detectionModel = FaceDetection::firstOrCreate(
                        [
                            'event_id' => $this->event->id,
                            'image_id' => $this->image->id,
                            'box_x' => $detection['box']['left'],
                            'box_y' => $detection['box']['top'],
                            'box_w' => $detection['box']['width'],
                            'box_h' => $detection['box']['height']
                        ]
                    );

                    if ($clientsInEvent->contains($detection['client_id'])) {
                        $detectionModel->resolved()->updateOrCreate(
                            [
                                'client_id' => $detection['client_id'],
                                'event_id' => $this->event->id,
                                'image_id' => $this->image->id,
                            ],
                            [
                                'confidence' => $detection['confidence'],
                            ]
                        );
                    }

                }
            });

        } catch (\Exception $e) {
            Log::error('Job SortImage falhou: '.$e->getMessage(), [
                'image_id' => $this->image->id,
            ]);

            throw $e;
        }
    }
}
