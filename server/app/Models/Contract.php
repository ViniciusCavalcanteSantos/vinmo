<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;

class Contract extends Model
{
    protected $fillable = ['user_id', 'category_id', 'code', 'title'];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function category() {
        return $this->belongsTo(ContractCategory::class);
    }

    public function graduationDetail() {
        return $this->hasOne(ContractGraduationDetail::class, 'contract_id', 'id');
    }

    public function isGraduation() {
        if (!$this->relationLoaded('category')) {
            $this->load('category');
        }

        return $this->category->slug === 'graduation';
    }

    /**
     * Um Contrato pode ter um endereço (local do evento).
     */
    public function address(): MorphOne
    {
        return $this->morphOne(Address::class, 'addressable');
    }
}
