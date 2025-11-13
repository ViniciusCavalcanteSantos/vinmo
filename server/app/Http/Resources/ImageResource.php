<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *    schema="OriginalImageInfo",
 *    type="object",
 *    required={"name", "size", "width", "height", "mimeType"},
 *    @OA\Property(property="name", type="string", example="IMG_1234"),
 *    @OA\Property(property="size", type="integer", nullable=true, example=2456789, description="Tamanho em bytes da imagem original (se houver)"),
 *    @OA\Property(property="width", type="integer", example=1980, description="Largura da imagem original"),
 *    @OA\Property(property="height", type="integer", example=1080, description="Altura da imagem original"),
 *    @OA\Property(property="mimeType", type="string", example="image/jpeg"),
 * )
 *
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
 *   @OA\Property(property="width", type="integer", example=1980, description="Largura da imagem"),
 *   @OA\Property(property="height", type="integer", example=1080, description="Altura da imagem"),
 *   @OA\Property(property="mimeType", type="string", example="image/jpeg"),
 *   @OA\Property(property="original", ref="#/components/schemas/OriginalImageInfo"),
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
            'size' => (int) $this->size,
            'width' => (int) $this->width,
            'height' => (int) $this->height,
            'mimeType' => $this->mime_type,
            'createdAt' => $this->created_at->format('Y-m-d H:i:s'),
            'updatedAt' => $this->updated_at->format('Y-m-d H:i:s')
        ];

        if ($this->parent_id) {
            $data['original'] = [
                'name' => $this->original->original_name,
                'size' => $this->original->size,
                'width' => $this->original->width,
                'height' => $this->original->height,
                'mimeType' => $this->original->mime_type,
            ];
        } else {
            $data['original'] = [
                'name' => $this->original_name,
                'size' => $this->size,
                'width' => $this->width,
                'height' => $this->height,
                'mimeType' => $this->original->mime_type,
            ];
        }

        return $data;
    }
}
