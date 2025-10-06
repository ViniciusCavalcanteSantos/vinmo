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
            'street' => $this->street ?? null,
            'number' => $this->street ?? null,
            'neighborhood' => $this->street ?? null,
            'complement' => $this->street ?? null,
            'city' => $this->city,
            'state' => $this->state,
            'country' => $this->country,
        ];
    }
}
