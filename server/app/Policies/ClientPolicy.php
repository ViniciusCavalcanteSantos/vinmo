<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

class ClientPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    public function view(User $user, Client $client): bool
    {
        return $user->organization_id === $client->organization_id;
    }

    public function update(User $user, Client $client): bool
    {
        return $user->organization_id === $client->organization_id;
    }

    public function delete(User $user, Client $client): bool
    {
        return $user->organization_id === $client->organization_id;
    }

    public function create(): bool
    {
        return true;
    }
}
