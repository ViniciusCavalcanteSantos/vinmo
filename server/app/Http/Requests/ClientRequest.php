<?php

namespace App\Http\Requests;

use Illuminate\Validation\Rule;

class ClientRequest extends ApiFormRequest
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
        $isEdit = $this->isMethod('PUT') || $this->isMethod('PATCH');
        $rules = [
            'name' => 'required|string|max:60',
            'profile' => $isEdit ? 'nullable|file|image' : 'required|file|image',
            'inform_address' => 'required|boolean',
            'inform_guardian' => 'required|boolean',

            'code' => 'nullable|string|max:20',
            'birthdate' => 'nullable|date',
            'phone' => 'nullable|string|max:20',
        ];

        $informAddress = $this->input('inform_address');
        $informGuardian = $this->input('inform_guardian');

        if ($informAddress) {
            $rules = array_merge($rules, [
                'postal_code' => 'required|string|max:12',
                'street' => 'required|string|max:120',
                'number' => 'required|string|max:10',
                'neighborhood' => 'required|string|max:40',
                'complement' => 'nullable|string|max:120',
                'city' => 'required|string|max:40',
                'state' => 'required|string|max:12',
                'country' => 'required|string|size:2',
            ]);
        }

        if ($informGuardian) {
            $rules = array_merge($rules, [
                'guardian_name' => 'required|string|max:60',
                'guardian_type' => [
                    'required',
                    Rule::in([
                        'mother', 'father', 'grandmother', 'grandfather', 'uncle', 'aunt',
                        'sister', 'brother', 'godmother', 'godfather', 'other'
                    ])
                ],
                'guardian_email' => 'nullable|string|max:60',
                'guardian_phone' => 'nullable|string|max:20',
            ]);
        }

        return $rules;
    }
}
