<?php

namespace App\Models;

use App\Observers\EventObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[ObservedBy([EventObserver::class])]
class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'contract_id',
        'type_id',
        'event_date',
        'start_time',
        'description',
        'searchable'
    ];

    public function contract(): BelongsTo
    {
        return $this->belongsTo(Contract::class);
    }

    public function type(): BelongsTo
    {
        return $this->belongsTo(EventType::class);
    }

    public function clients()
    {
        return $this->belongsToMany(Client::class, 'client_event_assignments')
            ->withTimestamps();
    }

    public function images(): MorphMany
    {
        return $this->morphMany(Image::class, 'imageable');
    }

    public function clientImageLinks()
    {
        return $this->hasMany(FaceCrop::class);
    }

    protected function casts(): array
    {
        return [
            'event_date' => 'date:Y-m-d',
            'start_time' => 'datetime:H:i',
        ];
    }
}
