<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

/**
 * @OA\Schema(
 *   schema="User",
 *   type="object",
 *   required={"id", "name", "email", "address"},
 *   @OA\Property(property="id", type="integer", example=1),
 *   @OA\Property(property="name", type="string", example="Vinicius"),
 *   @OA\Property(property="email", type="string", example="vinicius@example.com"),
 *   @OA\Property(property="picture", type="string", format="uri", example="https://.../picture.jpg", nullable=true),
 *   @OA\Property(
 *      property="address",
 *      ref="#/components/schemas/FullAddress"
 *   )
 * )
 */
class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $this->load('address');
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'address' => new AddressResource($this->whenLoaded('address')),
            'picture' => $this->profile?->path ? Storage::url($this->profile->path) : null
        ];
    }
}
