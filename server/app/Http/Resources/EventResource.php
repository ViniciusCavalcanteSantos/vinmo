<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *       schema="EventType",
 *       type="object",
 *       required={"id", "name", "category"},
 *       @OA\Property(property="id", type="integer", example=3),
 *       @OA\Property(property="name", type="string", example="Ensaio"),
 *       @OA\Property(
 *          property="category",
 *          ref="#/components/schemas/ContractCategory",
 *    )
 * )
 *
 * @OA\Schema(
 *   schema="Event",
 *   type="object",
 *   required={"id", "contractId", "eventDate", "type", "totalImages", "totalSize", "createdAt", "autoAssignClients"},
 *   @OA\Property(property="id", type="integer", example=12),
 *   @OA\Property(property="contractId", type="integer", example=5),
 *   @OA\Property(property="title", type="string", format="date", example="Salão Nobre – 13/12"),
 *   @OA\Property(property="eventDate", type="string", format="date", example="2025-11-06"),
 *   @OA\Property(property="startTime", type="string", format="time", nullable=true, example="14:30"),
 *   @OA\Property(property="description", type="string", nullable=true, example="Cobertura da formatura"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", example="2025-11-06T12:00:00Z"),
 *   @OA\Property(
 *     property="contract",
 *     ref="#/components/schemas/Contract",
 *     nullable=true
 *   ),
 *   @OA\Property(property="totalImages", type="integer", example=120),
 *   @OA\Property(property="totalSize", type="integer", example=34567890, description="bytes"),
 *   @OA\Property(property="autoAssignClients", type="boolean", example=false, description="Informa se o evento vai atribuir clientes automaticamente"),
 *   @OA\Property(
 *     property="type",
 *     ref="#/components/schemas/EventType",
 *   )
 * )
 */
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
            'title' => $this->title,
            'eventDate' => $this->event_date->format('Y-m-d'),
            'startTime' => $this->start_time?->format('H:i'),
            'description' => $this->description,
            'createdAt' => $this->created_at->toIso8601String(),
            'contract' => new ContractResource($this->whenLoaded('contract')),
            'totalImages' => $this->images_count,
            'totalSize' => (int) $this->images_bytes,
            'autoAssignClients' => (bool) $this->auto_assign_clients,
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
