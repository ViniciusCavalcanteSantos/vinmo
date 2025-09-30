<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EventType extends Model
{
    protected $table = 'events_types';

    public function category(): BelongsTo
    {
        return $this->belongsTo(ContractCategory::class, 'category_id');
    }
}
