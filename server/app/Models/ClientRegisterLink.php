<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;

class ClientRegisterLink extends Model
{
    use HasUuids;

    protected $table = 'clients_register_links';
    protected $fillable = [
        'organization_id',
        'title', 'max_registers', 'require_address', 'require_guardian_if_minor', 'default_assignments',

    ];

    protected function casts(): array
    {
        return [
            'default_assignments' => 'array',
            'default_assignments.*' => 'integer',
        ];
    }
}
