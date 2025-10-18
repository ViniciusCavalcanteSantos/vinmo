<?php

namespace App\Models;

use App\Observers\ClientObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

#[ObservedBy([ClientObserver::class])]
class Client extends Model
{
    protected $fillable = [
        'organization_id',
        'code', 'name', 'birthdate', 'phone', 'rekognition_face_id',
        'guardian_name', 'guardian_type', 'guardian_email', 'guardian_phone', 'searchable'
    ];

    protected $casts = [
        'birthdate' => 'date',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function image(): MorphOne
    {
        return $this->morphOne(Image::class, 'imageable');
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
}
