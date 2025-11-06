<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *   schema="Contract",
 *   type="object",
 *   required={"id", "code", "title", "category", "address", "createdAt"},
 *   @OA\Property(property="id", type="integer", example=1),
 *   @OA\Property(property="code", type="string", example="CONT-0001"),
 *   @OA\Property(property="title", type="string", example="Formatura 3º Ano 2025"),
 *   @OA\Property(property="createdAt", type="string", format="date-time", example="2025-11-06T12:00:00Z"),
 *   @OA\Property(
 *     property="category",
 *     ref="#/components/schemas/ContractCategory"
 *   ),
 *   @OA\Property(
 *     property="address",
 *     ref="#/components/schemas/CityAreaAddress",
 *   ),
 *   @OA\Property(
 *     property="graduationDetails",
 *     ref="#/components/schemas/GraduationDetails",
 *     nullable=true
 *   )
 * )
 */
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
            'category' => new CategoryResource($this->whenLoaded('category')),
            'address' => new AddressResource($this->whenLoaded('address')),
            'graduationDetails' => new GraduationDetailResource($this->whenLoaded('graduationDetail')),
        ];
    }
}
