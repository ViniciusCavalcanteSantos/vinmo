<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FaceCropMatch extends Model
{
    protected $fillable = [
        'client_id', 'event_id', 'image_id', 'confidence', 'matched_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'confidence' => 'float',
    ];

    public function detection(): BelongsTo
    {
        return $this->belongsTo(FaceCrop::class, 'face_crop_id');
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class);
    }

    public function image(): BelongsTo
    {
        return $this->belongsTo(Image::class);
    }
}
