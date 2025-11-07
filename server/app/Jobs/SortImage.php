<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\FaceCrop;
use App\Models\Image;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class SortImage implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;
    public array $backoff = [5, 10, 15, 20, 30];

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
        $disk = $this->image->disk;
        $pathsToDelete = [];

        try {
            $imageAnalyzerFactory = (new ImageAnalyzerFactory(app()));
            $imageAnalyzer = $imageAnalyzerFactory->make();

            $detections = $imageAnalyzer->findAllKnownFacesInPhoto($this->image->path);
            $detections = collect($detections);

            $clientsInEvent = $this->event->clients()->pluck('clients.id')->toBase();

            $faceCropsToSaveDetails = [];

            DB::transaction(function () use (
                $detections,
                $clientsInEvent,
                $disk,
                &$pathsToDelete,
                &$faceCropsToSaveDetails
            ) {
                foreach ($detections as $detection) {
                    $cropedBinary = $detection['croppedImage'];
                    $croppedModel = $this->image->versions()->create([
                        'imageable_id' => $this->image->imageable_id,
                        'imageable_type' => $this->image->imageable_type,
                        'mime_type' => $this->image->mime_type,
                        'type' => 'crop',
                        'disk' => $disk,
                        'path' => '',
                        'size' => 0,
                    ]);
                    $croppedPath = $this->generateVersionPath($this->image->path, "crop_{$croppedModel->id}");

                    $pathsToDelete[] = $croppedPath;

                    $size = strlen($cropedBinary);
                    Storage::put($croppedPath, $cropedBinary);

                    $croppedModel->update([
                        'path' => $croppedPath,
                        'size' => $size,
                    ]);

                    $faceCrop = FaceCrop::firstOrCreate(
                        [
                            'event_id' => $this->event->id,
                            'image_id' => $croppedModel->id,
                            'original_image_id' => $this->image->id,
                            'box_x' => $detection['box']['left'],
                            'box_y' => $detection['box']['top'],
                            'box_w' => $detection['box']['width'],
                            'box_h' => $detection['box']['height']
                        ]
                    );


                    if ($clientsInEvent->contains($detection['client_id'])) {
                        $faceCrop->resolved()->updateOrCreate(
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

                    $faceCropsToSaveDetails[] = [$faceCrop, $detection['details']];
                }
            });

            foreach ($faceCropsToSaveDetails as [$faceCrop, $details]) {
                $faceCrop->saveFaceDetail($details);
            }

            \App\Models\PendingFaceReconciliation::firstOrCreate([
                'event_id' => $this->event->id,
                'image_id' => $this->image->id,
                'reason' => 'images_ready',
            ]);
            ReconcilePendingFaces::dispatch($this->event->id)->delay(now()->addSeconds(45));
        } catch (\Exception|\Throwable $e) {
            if (!empty($pathsToDelete)) {
                Storage::disk($disk)->delete($pathsToDelete);
            }

            Log::error('Job SortImage falhou: '.$e->getMessage(), [
                'image_id' => $this->image->id,
            ]);

            throw $e;
        }
    }

    /**
     * Gera o caminho para uma nova versão da imagem.
     */
    private function generateVersionPath(string $originalPath, string $suffix, string $extension = null): string
    {
        $info = pathinfo($originalPath);
        if (!$extension) {
            $extension = $info['extension'];
        }

        $dir = $info['dirname'] !== '.' ? rtrim($info['dirname'], '/') : '';
        $basename = $info['filename'];

        $filename = "{$basename}_{$suffix}.{$extension}";

        return $dir === '' ? $filename : ($dir.'/'.$filename);
    }
}
