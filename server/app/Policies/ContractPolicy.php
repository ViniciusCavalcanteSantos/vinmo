<?php

namespace App\Policies;

use App\Models\Contract;
use App\Models\User;

class ContractPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
    }

    public function view(User $user, Contract $contract): bool
    {
        return $user->organization_id === $contract->organization_id;
    }

    public function update(User $user, Contract $contract): bool
    {
        return $user->organization_id === $contract->organization_id;
    }

    public function delete(User $user, Contract $contract): bool
    {
        return $user->organization_id === $contract->organization_id;
    }

    public function create(): bool
    {
        return true;
    }
}
