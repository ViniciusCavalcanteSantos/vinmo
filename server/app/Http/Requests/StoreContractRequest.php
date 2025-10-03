<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class StoreContractRequest extends ApiFormRequest
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
            'category' => ['required', 'string', 'exists:contracts_categories,slug'],
            'code' => [
                'required',
                'string',
                'max:40',
                Rule::unique('contracts', 'code')->where('user_id', $userId)
            ],
            'title' => ['required', 'string', 'max:180'],
            'country' => ['required', 'string', 'size:3', 'alpha'],
            'state' => ['required', 'string', 'max:12'],
            'city' => ['required', 'string', 'max:40'],
        ];

        // Adiciona regras somente se a categoria for 'graduation'
        if ($this->input('category') === 'graduation') {
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
                    'university_course' => [
                        'required_if:type,university', 'nullable', 'string', 'max:120'
                    ]
                ];
            }
            if ($this->input('type') === 'school') {
                $conditionalRule = [
                    'school_grade_level' => [
                        'required_if:type,school', 'nullable',
                        Rule::in(['elementary_school', 'middle_school', 'high_school'])
                    ]
                ];
            }


            $rules = array_merge($rules, $graduationRules, $conditionalRule);
        }

        return $rules;
    }
}
