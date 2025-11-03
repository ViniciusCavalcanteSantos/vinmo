<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class FaceCrop extends Model
{
    protected $fillable = [
        'event_id', 'image_id', 'original_image_id',
        'box_x', 'box_y', 'box_w', 'box_h',
        'dismissed', 'best_client_id', 'best_confidence'
    ];

    protected $casts = [
    ];

    public function resolved(): HasOne
    {
        return $this->hasOne(FaceCropMatch::class, 'face_crop_id');
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

    public function saveFaceDetail($awsFace): FaceDetail
    {
        return saveFaceDetailFromAws($awsFace, $this->id);
    }
}
