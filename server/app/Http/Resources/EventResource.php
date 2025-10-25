<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'contractId' => $this->contract_id,
            'eventDate' => $this->event_date->format('Y-m-d'),
            'startTime' => $this->start_time?->format('H:i'),
            'description' => $this->description,
            'createdAt' => $this->created_at->toIso8601String(),
            'contract' => new ContractResource($this->whenLoaded('contract')),
            'type' => $this->whenLoaded('type', function ($type) {
                $type->load('category');
                return [
                    'id' => $type->id,
                    'name' => __($type->name),
                    'category' => new CategoryResource($type->category),
                ];
            }),
        ];
    }
}
