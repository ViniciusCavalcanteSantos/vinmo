<?php

namespace App\Http\Requests;

use App\Models\Contract;
use Illuminate\Validation\Rule;

class EventRequest extends ApiFormRequest
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
        if ($this->isMethod('POST')) {
            $rules = [
                'contract' => ['required', 'integer', 'exists:contracts,id'],
                'title' => ['required', 'string', 'max:180'],
                'event_type' => [
                    'required',
                    'integer',
                    Rule::exists('event_types', 'id')
                        ->where(function ($query) {
                            if ($contractId = $this->input('contract')) {
                                $contract = Contract::find($contractId);

                                if ($contract) {
                                    $query->where('category_id', $contract->category_id);
                                }
                            }
                        })
                ],
                'event_date' => ['required', 'date'],
                'auto_assign_clients' => ['sometimes', 'boolean']
            ];
        } else {
            $rules = [
                'contract' => ['sometimes', 'integer', 'exists:contracts,id'],
                'title' => ['sometimes', 'string', 'max:180'],
                'event_type' => [
                    'sometimes',
                    'integer',
                    Rule::exists('event_types', 'id')
                        ->where(function ($query) {
                            if ($contractId = $this->input('contract')) {
                                $contract = Contract::find($contractId);

                                if ($contract) {
                                    $query->where('category_id', $contract->category_id);
                                }
                            }
                        })
                ],
                'event_date' => ['sometimes', 'date'],
                'auto_assign_clients' => ['sometimes', 'boolean']

            ];
        }

        return array_merge($rules, [
            'event_start_time' => ['nullable', 'date_format:H:i'],
            'description' => ['nullable', 'string', 'max:300'],
        ]);
    }
}
