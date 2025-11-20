<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @OA\Schema(
 *   schema="FaceCropMatch",
 *   type="object",
 *   required={"id", "faceCropId", "clientId", "imageId", "matchedBy", "confidence"},
 *   @OA\Property(property="id", type="integer", example=2),
 *   @OA\Property(property="faceCropId", type="integer", example=2),
 *   @OA\Property(property="clientId", type="integer", example=18),
 *   @OA\Property(property="imageId", type="string", example="01kabknvc1fy2cvgen915mb0t3"),
 *   @OA\Property(property="matchedBy", type="string", enum={"rekognition", "manual"}, example="rekognition"),
 *   @OA\Property(property="confidence", type="number", format="float", example=99.97),
 *   @OA\Property(property="notes", type="string", nullable=true, example=null),
 *   @OA\Property(property="createdBy", type="integer", nullable=true, example=null),
 *   @OA\Property(property="aprovedBy", type="integer", nullable=true, example=null),
 *   @OA\Property(property="createdAt", type="string", format="date-time", example="2025-11-18T13:50:17.000000Z"),
 *   @OA\Property(property="updatedAt", type="string", format="date-time", example="2025-11-18T13:50:17.000000Z"),
 *   @OA\Property(
 *     property="faceCrop",
 *     ref="#/components/schemas/FaceCrop",
 *     nullable=true
 *   )
 * )
 */
class FaceCropMatchResource extends JsonResource
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
            'faceCropId' => $this->face_crop_id,
            'clientId' => $this->client_id,
            'imageId' => $this->image_id,
            'matchedBy' => $this->matched_by,
            'confidence' => $this->confidence,
            'notes' => $this->notes,
            'createdBy' => $this->created_by,
            'aprovedBy' => $this->aproved_by,
            'createdAt' => $this->created_at,
            'updatedAt' => $this->updated_at,
            'faceCrop' => new FaceCropResource($this->whenLoaded('faceCrop')),
        ];
    }
}
