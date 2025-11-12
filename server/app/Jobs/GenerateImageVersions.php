<?php

namespace App\Jobs;

use App\Models\Image;
use App\Services\ImageAnalysis\ImagePreparationService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class GenerateImageVersions implements ShouldQueue
{
    use Queueable;

    private const TYPE_WEB = 'web';
    private const TYPE_THUMB = 'thumb';
    private const WEB_WIDTH = 1900;
    private const THUMB_WIDTH = 300;

    /**
     * Create a new job instance.
     */
    public function __construct(public Image $image)
    {
    }

    /**
     * Execute the job.
     * @throws \Throwable
     */
    public function handle(): void
    {
        $disk = $this->image->disk;
        $originalPath = $this->image->path;
        $pathsToDelete = [];
        try {
            $originalContents = Storage::disk($disk)->get($originalPath);

            $webPath = $this->generateVersionPath($originalPath, self::TYPE_WEB, 'webp');
            $webImage = ImagePreparationService::from($originalContents)
                ->limitDimensions(self::WEB_WIDTH, self::WEB_WIDTH)
                ->ensureFormat(['image/webp'], 80)
                ->fitBytes()
                ->clearMetadata();

            Storage::disk($disk)->put($webPath, $webImage->toFilePointer());
            $pathsToDelete[] = $webPath;

            $thumbPath = $this->generateVersionPath($originalPath, self::TYPE_THUMB, 'webp');
            $thumbImage = ImagePreparationService::from($originalContents)
                ->limitDimensions(self::THUMB_WIDTH, self::THUMB_WIDTH)
                ->ensureFormat(['image/webp'], 70)
                ->fitBytes()
                ->clearMetadata();

            Storage::disk($disk)->put($thumbPath, $thumbImage->toFilePointer());
            $pathsToDelete[] = $thumbPath;

            DB::transaction(function () use ($disk, $webPath, $thumbPath, $webImage, $thumbImage) {
                $this->image->versions()->create([
                    'imageable_id' => $this->image->imageable_id,
                    'imageable_type' => $this->image->imageable_type,
                    'disk' => $disk,
                    'path' => $webPath,
                    'type' => self::TYPE_WEB,
                    'size' => $webImage->getFileSize(),
                    'mime_type' => 'image/webp',
                ]);

                $this->image->versions()->create([
                    'imageable_id' => $this->image->imageable_id,
                    'imageable_type' => $this->image->imageable_type,
                    'disk' => $disk,
                    'path' => $thumbPath,
                    'type' => self::TYPE_THUMB,
                    'size' => $thumbImage->getFileSize(),
                    'mime_type' => 'image/webp',
                ]);
            });
        } catch (\Throwable $e) {
            if (!empty($pathsToDelete)) {
                Storage::disk($disk)->delete($pathsToDelete);
            }

            Log::error('Job GenerateImageVersions falhou: '.$e->getMessage(), [
                'image_id' => $this->image->id,
                'original_path' => $originalPath,
            ]);

            throw $e;
        }
    }

    /**
     * Gera o caminho para uma nova versão da imagem.
     */
    private function generateVersionPath(string $originalPath, string $suffix, string $extension): string
    {
        $info = pathinfo($originalPath);
        $dir = $info['dirname'] !== '.' ? rtrim($info['dirname'], '/') : '';
        $basename = $info['filename'];

        $filename = "{$basename}_{$suffix}.{$extension}";

        return $dir === '' ? $filename : ($dir.'/'.$filename);
    }
}
