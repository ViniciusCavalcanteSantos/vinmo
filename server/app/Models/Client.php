<?php

namespace App\Models;

use App\Observers\ClientObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Facades\Storage;

#[ObservedBy([ClientObserver::class])]
class Client extends Model
{
    protected $fillable = [
        'user_id',
        'code', 'name', 'birthdate', 'phone', 'profile_url',
        'guardian_name', 'guardian_type', 'guardian_email', 'guardian_phone', 'searchable'
    ];

    protected $casts = [
        'birthdate' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Um Cliente pode ter um endereço (ocal onde mora).
     */
    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }

    public function events()
    {
        return $this->belongsToMany(Event::class, 'clients_event_assignments')
            ->withTimestamps();
    }


    public function getProfileUrlFullAttribute(): ?string
    {
        return $this->attributes['profile_url']
            ? Storage::url($this->attributes['profile_url'])
            : null;
    }
}
