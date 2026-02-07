<?php

namespace App\Notifications\Channels;

use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Redis;

class SseRedisChannel
{
    /**
     * Send the given notification.
     */
    public function send($notifiable, Notification $notification): void
    {
        $data = [
            'id' => $notification->id,
            'type' => get_class($notification),
            'notifiable_id' => $notifiable->id,
            'notifiable_type' => get_class($notifiable),
            'data' => $notification->toArray($notifiable),
            'read_at' => null,
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString(),
        ];

        Redis::publish('sse:user:' . $notifiable->id, json_encode($data));
    }
}
