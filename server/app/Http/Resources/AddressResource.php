<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AddressResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'granularity' => $this->granularity,
            'postalCode' => $this->postal_code ?? null,
            'street' => $this->street ?? null,
            'number' => $this->number ?? null,
            'neighborhood' => $this->neighborhood ?? null,
            'complement' => $this->complement ?? null,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
        ];
    }
}
