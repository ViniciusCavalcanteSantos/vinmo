<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ImageMeta extends Model
{
    protected $fillable = [
        'image_id',
        'key',
        'value',
    ];
}
