<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class DeleteImageFiles implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected array $paths, protected string $disk = 's3')
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $failed = Storage::disk($this->disk)->delete($this->paths);
        if (is_array($failed) && count($failed)) {
            Log::warning('Falha ao apagar arquivos de imagem', [
                'paths' => $failed,
            ]);
        }
    }
}
