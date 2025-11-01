<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaceDetailLandmark extends Model
{
    protected $fillable = [
        'face_detail_id',
        'type', 'x', 'y'
    ];

    public function faceDetail(): BelongsTo
    {
        return $this->belongsTo(FaceDetail::class);
    }
}
