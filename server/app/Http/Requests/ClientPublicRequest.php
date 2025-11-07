<?php

namespace App\Http\Requests;

use App\Models\ClientRegisterLink;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Carbon;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class ClientPublicRequest extends FormRequest
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
        $rules = [
            'code' => 'nullable|string|max:20|regex:/^[A-Z0-9_-]+$/i',
            'name' => 'required|string|max:60',
            'profile' => 'required|file|image|max:25600',
            'birthdate' => 'required|date',
            'phone' => 'required|string|max:20',

            'inform_address' => 'sometimes|boolean',
            'inform_guardian' => 'sometimes|boolean',

            'assignments' => 'sometimes|array',
            'assignments.*' => 'integer|distinct|exists:events,id',

        ];

        $informAddress = $this->get('inform_address');
        $informGuardian = $this->get('inform_guardian');

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

    protected function prepareForValidation(): void
    {
        $token = $this->route('linkId');
        $linkId = base64_decode($token);
        $link = ClientRegisterLink::find($linkId);

        if (!$link) {
            throw ValidationException::withMessages([
                'link' => [__('Link not found')],
            ]);
        }

        $informGuardian = false;
        if ($link->require_guardian_if_minor) {
            $birthdate = Carbon::make($this->get('birthdate'));

            if ($birthdate) {
                $years = $birthdate->diffInYears(Carbon::now());
                if ($years < 18) {
                    $informGuardian = true;
                }
            }
        }

        if ($link) {
            $this->merge([
                'inform_address' => (bool) $link->require_address,
                'inform_guardian' => $informGuardian,
                'assignments' => (array) $link->default_assignments,
            ]);
        }
    }
}
