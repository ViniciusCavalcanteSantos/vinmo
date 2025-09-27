<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContractGraduationDetail extends Model
{
    protected $table = 'contracts_graduation_details';

    protected $fillable = ['type', 'institution_name', 'institution_acronym', 'class', 'shift', 'conclusion_year', 'university_course', 'school_grade_level'];

    public function contract() {
        return $this->belongsTo(Contract::class);
    }

    public function isUniversity()
    {
        return $this->type === 'university';
    }

    public function isSchool()
    {
        return $this->type === 'school';
    }
}
