<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingFaceReconciliation extends Model
{
    protected $fillable = ['event_id', 'image_id', 'reason'];
}
