<?php

namespace App\Models;

use App\Observers\ContractObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;

#[ObservedBy([ContractObserver::class])]
class Contract extends Model
{
    use HasFactory;

    protected $fillable = ['organization_id', 'category_id', 'code', 'title', 'searchable'];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(ContractCategory::class);
    }

    public function graduationDetail(): HasOne
    {
        return $this->hasOne(ContractGraduationDetail::class, 'contract_id', 'id');
    }

    public function isGraduation(): bool
    {
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
