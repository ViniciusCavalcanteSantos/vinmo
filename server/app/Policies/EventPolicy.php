<?php

namespace App\Policies;

use App\Models\Event;
use App\Models\User;

class EventPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function view(User $user, Event $event): bool
    {
        return $user->organization_id === $event->organization_id;
    }

    public function update(User $user, Event $event): bool
    {
        return $user->organization_id === $event->organization_id;
    }

    public function delete(User $user, Event $event): bool
    {
        return $user->organization_id === $event->organization_id;
    }

    public function create(): bool
    {
        return true;
    }
}
