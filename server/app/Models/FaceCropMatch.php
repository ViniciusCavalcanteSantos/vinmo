<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\Pivot;

class FaceCropMatch extends Pivot
{
    protected $table = 'face_crop_matches';
    protected $with = ['faceCrop'];
    
    protected $fillable = [
        'face_crop_id', 'client_id', 'event_id', 'image_id', 'confidence', 'matched_by'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'confidence' => 'float',
    ];


    public function faceCrop(): BelongsTo
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
