<?php

namespace App\Models;

use App\Observers\AddressObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

#[ObservedBy([AddressObserver::class])]
class Address extends Model
{
    use HasFactory;

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
