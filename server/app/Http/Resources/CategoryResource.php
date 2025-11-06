<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *   schema="ContractCategory",
 *   type="object",
 *   required={"name", "slug"},
 *   @OA\Property(property="name", type="string", example="Formatura"),
 *   @OA\Property(property="slug", type="string", example="formatura")
 * )
 */
class CategoryResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'name' => __($this->name),
            'slug' => $this->slug,
        ];
    }
}
