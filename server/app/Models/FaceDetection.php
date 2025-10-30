<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class FaceDetection extends Model
{
    protected $fillable = [
        'event_id', 'image_id',
        'box_x', 'box_y', 'box_w', 'box_h',
        'dismissed',
    ];

    protected $casts = [
    ];

    public function resolved(): HasOne
    {
        return $this->hasOne(ResolvedFace::class, 'face_detection_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }
}
