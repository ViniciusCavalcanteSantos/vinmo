<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GraduationDetailResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'type' => $this->type,
            'institution' => $this->institution_name,
            'acronym' => $this->institution_acronym,
            'className' => $this->class,
            'shift' => $this->shift,
            'conclusionYear' => $this->conclusion_year,
            'universityCourse' => $this->when($this->isUniversity(), $this->university_course),
            'schoolGradeLevel' => $this->when($this->isSchool(), $this->school_grade_level),
        ];
    }
}
