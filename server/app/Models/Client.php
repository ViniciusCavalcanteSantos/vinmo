<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Client extends Model
{
    protected $fillable = [
        'user_id',
        'code', 'name', 'birthdate', 'phone', 'profile_url',
        'guardian_name', 'guardian_type', 'guardian_email', 'guardian_phone',
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
}
