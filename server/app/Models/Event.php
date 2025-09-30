<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'type_id',
        'event_date',
        'start_time',
        'description',
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(EventType::class);
    }

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'start_time' => 'datetime:H:i',
        ];
    }
}
