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

            DB::transaction(function () use ($detections, $clientsInEvent, $disk, &$pathsToDelete) {
                foreach ($detections as $detection) {
                    $croppedImage = $detection['croppedImage'];
                    $croppedModel = $this->image->versions()->create([
                        'imageable_id' => $this->image->imageable_id,
                        'imageable_type' => $this->image->imageable_type,
                        'mime_type' => $this->image->mime_type,
                        'type' => 'crop',
                        'disk' => $disk,
                        'path' => '',
                        'size' => $croppedImage->size(),
                    ]);
                    $croppedPath = $this->generateVersionPath($this->image->path, "crop_{$croppedModel->id}");

                    $pathsToDelete[] = $croppedPath;

                    Storage::put($croppedPath, $croppedImage->toFilePointer());

                    $croppedModel->update(['path' => $croppedPath]);

                    $detectionModel = FaceCrop::firstOrCreate(
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

                    $detectionModel->saveFaceDetail($detection['details']);

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
