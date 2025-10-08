<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'profileUrl' => $this->profile_url,
            'birthdate' => $this->birthdate?->format('Y-m-d'),
            'phone' => $this->phone,
            'guardian' => [
                'name' => $this->guardian_name,
                'type' => $this->guardian_type,
                'email' => $this->guardian_email,
                'phone' => $this->guardian_phone,
            ],
            'createdAt' => $this->created_at->toIso8601String(),
            'address' => new AddressResource($this->whenLoaded('address')),
        ];
    }
}
