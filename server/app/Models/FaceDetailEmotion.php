<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaceDetailEmotion extends Model
{
    protected $fillable = [
        'face_detail_id',
        'type', 'confidence'
    ];

    public function faceDetail(): BelongsTo
    {
        return $this->belongsTo(FaceDetail::class);
    }
}
