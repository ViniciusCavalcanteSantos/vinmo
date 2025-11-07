<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\FaceCrop;
use App\Models\PendingFaceReconciliation;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\ThrottlesExceptions;
use Illuminate\Queue\Middleware\WithoutOverlapping;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class ReconcilePendingFaces implements ShouldQueue
{
    use Queueable, Dispatchable, SerializesModels;

    public int $tries = 5;
    public int $backoff = 10;

    /**
     * Create a new job instance.
     */
    public function __construct(public int $eventId, public int $threshold = 85)
    {
    }

    public function middleware()
    {
        return [
            (new WithoutOverlapping($this->uniqueId()))->dontRelease(),
            (new ThrottlesExceptions(5, 60))
        ];
    }

    public function uniqueId(): string
    {
        return "reconcile:event:{$this->eventId}";
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        try {
            $event = Event::with('clients:id')->find($this->eventId);
            if (!$event) {
                return;
            }

            $allowed = $event->clients->pluck('id')->toBase();
            $analyzer = app(ImageAnalyzerFactory::class)->make();

            PendingFaceReconciliation::where('event_id', $this->eventId)
                ->orderBy('id')
                ->chunkById(100, function ($pendings) use ($event, $allowed, $analyzer) {
                    foreach ($pendings as $pending) {
                        $imageIds = collect();

                        if ($pending->image_id) {
                            $imageIds->push($pending->image_id);
                        } else {
                            $imageIds = FaceCrop
                                ::query()
                                ->where('event_id', $this->eventId)
                                ->whereDoesntHave('resolved')
                                ->distinct()
                                ->pluck('original_image_id');
                        }

                        $imageIds->chunk(50)->each(function ($ids) use ($event, $allowed, $analyzer) {
                            Log::debug('ids-', $ids->toArray());

                            FaceCrop::query()
                                ->where('event_id', $this->eventId)
                                ->whereIn('original_image_id', $ids)
                                ->whereDoesntHave('resolved')
                                ->orderBy('id')
                                ->chunkById(200, function ($faceCrops) use ($event, $allowed, $analyzer) {
                                    foreach ($faceCrops as $faceCrop) {
                                        $cropImage = $faceCrop->image;

                                        if (!$cropImage) {
                                            continue;
                                        }

                                        $disk = $cropImage->disk ?? config('filesystems.default');
                                        if (!Storage::disk($disk)->exists($cropImage->path)) {
                                            continue;
                                        }

                                        try {
                                            $match = $analyzer->searchSingleFaceCrop($cropImage->path,
                                                $this->threshold);

                                            if (!$match || empty($match['client_id'])) {
                                                continue;
                                            }

                                            $client_id = $match['client_id'];
                                            if (!$allowed->contains($client_id)) {
                                                continue;
                                            }

                                            $faceCrop->resolved()->updateOrCreate(
                                                [
                                                    'client_id' => $client_id,
                                                    'event_id' => $this->eventId,
                                                    'image_id' => $faceCrop->original_image_id
                                                ],
                                                [
                                                    'confidence' => (float) $match['confidence'] ?? 0.00,
                                                ]
                                            );

                                        } catch (\Throwable|\Exception $e) {
                                            Log::error('Reconcile error', [
                                                'face_crop_id' => $faceCrop->id,
                                                'event_id' => $event->id,
                                                'message' => $e->getMessage(),
                                            ]);
                                        }
                                    }
                                });
                        });

                        $pending->delete();
                    }
                });
        } catch (\Throwable $e) {
            Log::error('Reconcile error', (array) $e->getMessage());
            throw $e;
        }

    }
}
