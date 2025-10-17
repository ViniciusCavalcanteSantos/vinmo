<?php

namespace App\Jobs;

use App\Models\Image;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Encoders\WebpEncoder;
use Intervention\Image\Laravel\Facades\Image as InterventionImage;

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
            $interventionImage = InterventionImage::read($originalContents);

            $webPath = $this->generateVersionPath($originalPath, self::TYPE_WEB, 'webp');
            $webImage = (clone $interventionImage)
                ->scaleDown(self::WEB_WIDTH)
                ->encode(new WebpEncoder(quality: 80));

            Storage::disk($disk)->put($webPath, $webImage->toFilePointer());
            $pathsToDelete[] = $webPath;

            $thumbPath = $this->generateVersionPath($originalPath, self::TYPE_THUMB, 'webp');
            $thumbImage = (clone $interventionImage)
                ->scaleDown(self::THUMB_WIDTH)
                ->encode(new WebpEncoder(quality: 75));

            Storage::disk($disk)->put($thumbPath, $thumbImage->toFilePointer());
            $pathsToDelete[] = $thumbPath;

            DB::transaction(function () use ($disk, $webPath, $thumbPath, $webImage, $thumbImage) {
                $this->image->versions()->create([
                    'imageable_id' => $this->image->imageable_id,
                    'imageable_type' => $this->image->imageable_type,
                    'disk' => $disk,
                    'path' => $webPath,
                    'type' => self::TYPE_WEB,
                    'size' => $webImage->size(),
                    'mime_type' => 'image/webp',
                ]);

                $this->image->versions()->create([
                    'imageable_id' => $this->image->imageable_id,
                    'imageable_type' => $this->image->imageable_type,
                    'disk' => $disk,
                    'path' => $thumbPath,
                    'type' => self::TYPE_THUMB,
                    'size' => $thumbImage->size(),
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
