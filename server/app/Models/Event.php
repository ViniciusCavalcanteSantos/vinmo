<?php

namespace App\Models;

use App\Jobs\DeleteStoragePaths;
use App\Observers\EventObserver;
use App\Policies\EventPolicy;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Attributes\UsePolicy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;

#[UsePolicy(EventPolicy::class)]
#[ObservedBy([EventObserver::class])]
class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'organization_id',
        'contract_id',
        'type_id',
        'title',
        'event_date',
        'start_time',
        'description',
        'searchable',
        'auto_assign_clients'
    ];

    protected static function boot()
    {
        parent::boot();

        static::deleting(function (Event $event) {
            $paths = $event->images()->pluck('path')->toArray();
            DeleteStoragePaths::dispatch($paths);
        });
    }

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

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
