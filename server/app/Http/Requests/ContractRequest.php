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
        $userId = $this->user()->id;
        $rules = [
            'title' => ['required', 'string', 'max:180'],
            'country' => ['required', 'string', 'size:2', 'alpha'],
            'state' => ['required', 'string', 'max:12'],
            'city' => ['required', 'string', 'max:40'],
        ];

        if ($this->isMethod('POST')) {
            $rules['category'] = ['required', 'string', 'exists:contracts_categories,slug'];
            $rules['code'] = [
                'required',
                'string',
                'max:40',
                Rule::unique('contracts', 'code')->where('user_id', $userId)
            ];
        } else {
            $contractId = $this->route('contract')->id;
            $rules['code'] = [
                'required',
                'string',
                'max:40',
                Rule::unique('contracts', 'code')
                    ->where('user_id', $userId)
                    ->ignore($contractId)
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
