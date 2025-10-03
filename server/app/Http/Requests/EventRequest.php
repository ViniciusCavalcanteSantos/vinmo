<?php

namespace App\Http\Requests;

use App\Models\Contract;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class EventRequest extends FormRequest
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
        return [
            'contract' => ['required', 'integer', 'exists:contracts,id'],
            'event_type' => [
                'required',
                'integer',
                Rule::exists('events_types', 'id')
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
            'event_start_time' => ['nullable', 'date_format:H:i'],
            'description' => ['nullable', 'string', 'max:300'],
        ];
    }
}
