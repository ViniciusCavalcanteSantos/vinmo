<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *   schema="Image",
 *   type="object",
 *   required={"id", "url", "type", "size", "mimeType", "createdAt", "updatedAt"},
 *   @OA\Property(property="id", type="string", example="01J5Q8V6WZ3QC4FJ0V5E5VQ7R9"),
 *   @OA\Property(property="url", type="string", format="uri", example="https://s3.amazonaws.com/bucket/image.jpg"),
 *   @OA\Property(
 *     property="type",
 *     type="string",
 *     description="Versão da imagem (ex: original, web, thumb)",
 *     example="original"
 *   ),
 *   @OA\Property(property="size", type="integer", example=2456789, description="Tamanho em bytes"),
 *   @OA\Property(property="mimeType", type="string", example="image/jpeg"),
 *   @OA\Property(property="originalName", type="string", example="IMG_1234"),
 *   @OA\Property(property="originalSize", type="integer", nullable=true, example=2456789, description="Tamanho em bytes da imagem original (se houver)"),
 *   @OA\Property(property="createdAt", type="string", example="2025-11-06 10:15:00"),
 *   @OA\Property(property="updatedAt", type="string", example="2025-11-06 10:20:00")
 * )
 */
class ImageResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $data = [
            'id' => $this->id,
            'url' => $this->url,
            'type' => $this->type,
            'size' => $this->size,
            'mimeType' => $this->mime_type,
            'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at->format('Y-m-d H:i:s')
        ];

        if ($this->parent_id) {
            $data['originalName'] = $this->original->original_name;
            $data['originalSize'] = $this->original->size;
        } else {
            $data['originalName'] = $this->original_name;
            $data['originalSize'] = $this->size;
        }

        return $data;
    }
}
