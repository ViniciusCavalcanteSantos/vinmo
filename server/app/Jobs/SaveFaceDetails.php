<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class SaveFaceDetails implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(protected array $faceDetails)
    {
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //
    }
}
