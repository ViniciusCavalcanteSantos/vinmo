<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Address extends Model
{
    protected $fillable = [
        'granularity',
        'label',
        'postal_code',
        'street',
        'number',
        'complement',
        'neighborhood',
        'city',
        'state',
        'country',
    ];

    /**
     * Define o relacionamento polimórfico.
     * Um endereço pertence a um "endereçável" (Contract, User, etc.).
     */
    public function addressable(): MorphTo
    {
        return $this->morphTo();
    }
}
