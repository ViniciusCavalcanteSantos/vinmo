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
        $array = [
            'id' => $this->id,
            'code' => $this->code,
            'name' => $this->name,
            'profileUrl' => $this->profile_url_full,
            'birthdate' => $this->birthdate?->format('Y-m-d'),
            'phone' => $this->phone,

            'createdAt' => $this->created_at->toIso8601String(),
            'address' => new AddressResource($this->whenLoaded('address')),
        ];

        if ($this->guardian_name) {
            $array = array_merge($array, [
                'guardian' => [
                    'name' => $this->guardian_name,
                    'type' => $this->guardian_type,
                    'email' => $this->guardian_email,
                    'phone' => $this->guardian_phone,
                ],
            ]);
        }

        return $array;
    }
}
