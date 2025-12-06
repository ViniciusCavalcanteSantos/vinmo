<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Notification;

class SystemNotification extends Notification implements ShouldQueue, ShouldBroadcast
{
    use Queueable;

    private string $message;
    private string $description;
    private ?array $action;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $message, string $description)
    {
        $this->message = $message;
        $this->description = $description;
        $this->action = $action ?? ['type' => 'none', 'target' => null];
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database', 'broadcast'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'message' => $this->message,
            'description' => $this->description,
            'action' => $this->action,
            'created_at' => now()->toISOString()
        ];
    }

    public function toBroadcast(object $notifiable): BroadcastMessage
    {
        return new BroadcastMessage([
            'id' => $this->id,
            'data' => $this->toArray($notifiable),
            'read_at' => null
        ]);
    }
}
