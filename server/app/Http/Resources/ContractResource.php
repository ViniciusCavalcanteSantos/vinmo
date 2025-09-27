<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContractResource extends JsonResource
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
            'title' => $this->title,
            'createdAt' => $this->created_at->toIso8601String(),

            'address' => new AddressResource($this->whenLoaded('address')),
            'graduationDetails' => new GraduationDetailResource($this->whenLoaded('graduationDetail')),
        ];
    }
}
