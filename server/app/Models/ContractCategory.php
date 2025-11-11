<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ContractCategory extends Model
{
    protected $table = 'contract_categories';
    protected $fillable = ['name', 'slug'];

    public function eventTypes(): HasMany
    {
        return $this->hasMany(EventType::class);
    }

    public function contracts(): hasMany
    {
        return $this->hasMany(Contract::class);
    }
}
