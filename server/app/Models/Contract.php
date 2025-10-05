<?php

namespace App\Models;

use App\Observers\ContractObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Laravel\Scout\Searchable;

#[ObservedBy([ContractObserver::class])]
class Contract extends Model
{
    use HasFactory, Searchable;

    protected $fillable = ['user_id', 'category_id', 'code', 'title', 'searchable'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(ContractCategory::class);
    }

    public function graduationDetail()
    {
        return $this->hasOne(ContractGraduationDetail::class, 'contract_id', 'id');
    }

    public function isGraduation()
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

    public function toSearchableArray()
    {
        $this->load('address', 'graduationDetail');

        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'category_id' => $this->category_id,
            'code' => $this->code,
            'title' => $this->title,
            'city' => $this->address?->city,
            'state' => $this->address?->state,
            'neighborhood' => $this->address?->neighborhood,
            'institution_name' => $this->graduationDetail?->institution_name,
            'class' => $this->graduationDetail?->class,
            'university_course' => $this->graduationDetail?->university_course,
        ];
    }
}
