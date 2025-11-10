<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ContractRequest extends ApiFormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $organizationId = $this->user()->organization_id;

        if ($this->isMethod('POST')) {
            $rules = [
                'title' => ['required', 'string', 'max:180'],
                'country' => ['required', 'string', 'size:2', 'alpha'],
                'state' => ['required', 'string', 'max:12'],
                'city' => ['required', 'string', 'max:40'],

                'category' => ['required', 'string', 'exists:contract_categories,slug'],
                'code' => [
                    'required',
                    'string',
                    'max:40',
                    Rule::unique('contracts', 'code')->where('organization_id', $organizationId),
                ],
            ];
        } else {
            $contractId = $this->route('contract')->id;
            $rules = [
                'title' => ['sometimes', 'string', 'max:180'],
                'country' => ['sometimes', 'string', 'size:2', 'alpha'],
                'state' => ['sometimes', 'string', 'max:12'],
                'city' => ['sometimes', 'string', 'max:40'],

                'code' => [
                    'sometimes',
                    'string',
                    'max:40',
                    Rule::unique('contracts', 'code')
                        ->where('organization_id', $organizationId)
                        ->ignore($contractId),
                ],
            ];
        }

        if ($this->isMethod('POST')) {
            $isGraduationCategory = $this->input('category') === 'graduation';
        } else {
            $isGraduationCategory = $this->route('contract')->category->slug === 'graduation';
        }

        if ($isGraduationCategory) {
            $graduationRules = [
                'type' => ['required', Rule::in(['university', 'school'])],
                'institution_name' => ['required', 'string', 'max:180'],
                'institution_acronym' => ['nullable', 'string', 'max:20'],
                'class' => ['required', 'string', 'max:40'],
                'shift' => ['required', Rule::in(['morning', 'afternoon', 'night', 'full_time'])],
                'conclusion_year' => ['required', 'date_format:Y'],
            ];

            $conditionalRule = [];
            if ($this->input('type') === 'university') {
                $conditionalRule = [
                    'university_course' => ['required', 'string', 'max:120']
                ];
            }
            if ($this->input('type') === 'school') {
                $conditionalRule = [
                    'school_grade_level' => [
                        'required', Rule::in(['elementary_school', 'middle_school', 'high_school'])
                    ]
                ];
            }

            $rules = array_merge($rules, $graduationRules, $conditionalRule);
        }

        return $rules;
    }
}
