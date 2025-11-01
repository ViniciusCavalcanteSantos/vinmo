<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FaceDetail extends Model
{
    protected $fillable = [
        'face_crop_id', 'face_confidence', 'age_low', 'age_high',
        'gender_value', 'gender_confidence',
        'eye_direction_confidence', 'eye_direction_pitch', 'eye_direction_yaw',
        'pose_pitch', 'pose_roll', 'pose_yaw',
        'quality_brightness', 'quality_sharpness',
        'beard_value', 'beard_confidence',
        'mustache_value', 'mustache_confidence',
        'eyeglasses_value', 'eyeglasses_confidence',
        'sunglasses_value', 'sunglasses_confidence',
        'eyes_open_value', 'eyes_open_confidence',
        'mouth_open_value', 'mouth_open_confidence',
        'face_occluded_value', 'face_occluded_confidence',
        'smile_value', 'smile_confidence',
        'raw',
    ];

    protected $casts = [
        'beard_value' => 'bool',
        'mustache_value' => 'bool',
        'eyeglasses_value' => 'bool',
        'sunglasses_value' => 'bool',
        'eyes_open_value' => 'bool',
        'mouth_open_value' => 'bool',
        'face_occluded_value' => 'bool',
        'smile_value' => 'bool',
        'raw' => 'array',
    ];

    public function faceCrop(): BelongsTo
    {
        return $this->belongsTo(FaceCrop::class, 'face_crop_id');
    }

    public function emotions(): HasMany
    {
        return $this->hasMany(FaceDetailEmotion::class);
    }

    public function landmarks(): HasMany
    {
        return $this->hasMany(FaceDetailLandmark::class);
    }
}
