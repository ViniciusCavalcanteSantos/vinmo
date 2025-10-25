<?php

namespace App\Services;

use App\Http\Requests\EventPhotoRequest;
use App\Jobs\GenerateImageVersions;
use App\Jobs\SortImage;
use App\Models\Event;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use App\Services\ImageAnalysis\ImagePreparationService;
use App\Services\ImageAnalysis\Interfaces\ImageAnalyzer;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class EventPhotoService
{
    protected ImageAnalyzer $imageAnalyzer;

    public function __construct(ImageAnalyzerFactory $analyzerFactory)
    {
        $this->imageAnalyzer = $analyzerFactory->make();
    }

    public function uploadPhoto(EventPhotoRequest $request, Event $event)
    {
        $photo = $request->file('photo');

        return DB::transaction(function () use ($event, $photo) {
            $this->processAndStoreProfilePhoto($event, $photo);

            return $event->fresh();
        });
    }

    public function processAndStoreProfilePhoto(Event $event, $uploaded)
    {
        $processed = ImagePreparationService::from($uploaded)
            ->fixOrientation()
            ->limitDimensions()
            ->ensureFormat()
            ->fitBytes();

        $bytes = $processed->getAsBytes();
        $ext = $processed->getExtension();
        $mime = $processed->getMimetype();

        $image = $event->images()->create([
            'path' => '',
            'size' => 0,
            'mime_type' => '',
        ]);

        $path = StoragePathService::getEventPhotoFolder($event->id, "{$image->id}.{$ext}");
        if (!Storage::put($path, $bytes)) {
            throw new \RuntimeException('Unable to store event photo.');
        }

        try {
            $image->fill([
                'path' => $path,
                'size' => strlen($bytes),
                'mime_type' => $mime,
            ])->save();

            SortImage::dispatch($image, $event);
            GenerateImageVersions::dispatch($image);
        } catch (\Exception $e) {
            Storage::delete($path);
            throw ValidationException::withMessages(['photo_upload' => $e->getMessage()]);
        } catch (\Throwable $e) {
            Storage::delete($path);
            throw $e;
        }
    }
}