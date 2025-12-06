<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     schema="NotificationData",
 *     type="object",
 *     required={"message", "description", "action"},
 *     @OA\Property(property="message", type="string", example="Atualização de sistema"),
 *     @OA\Property(property="description", type="string", example="O sistema foi atualizado para a versão 2.3."),
 *     @OA\Property(
 *         property="action",
 *         type="object",
 *         description="Dados de ação adicionais (objeto JSON). Pode conter campos como 'type', 'target', etc.",
 *         @OA\AdditionalProperties(type="string")
 *     )
 * )
 *
 * @OA\Schema(
 *     schema="Notification",
 *     type="object",
 *     required={"id", "type", "notifiableType", "notifiableId", "data", "createdAt"},
 *     @OA\Property(property="id", type="string", format="uuid", example="311d5e06-7fcf-4a33-b79f-0f2c9e15173c"),
 *     @OA\Property(property="type", type="string", example="App\\Notifications\\SystemNotification"),
 *     @OA\Property(property="notifiableType", type="string", example="App\\Models\\User"),
 *     @OA\Property(property="notifiableId", type="integer", example=123),
 *     @OA\Property(property="data", ref="#/components/schemas/NotificationData"),
 *     @OA\Property(property="readAt", type="string", format="date-time", nullable=true, example="2025-11-06T10:15:00Z"),
 *     @OA\Property(property="createdAt", type="string", format="date-time", example="2025-11-06T10:15:00Z")
 * )
 */
class NotificationResource extends JsonResource
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
            'type' => $this->type,
            'notifiableType' => $this->notifiable_type,
            'notifiableId' => $this->notifiable_id,
            'data' => $this->data,
            'readAt' => $this->read_at,
            'createdAt' => $this->created_at
        ];
    }
}
