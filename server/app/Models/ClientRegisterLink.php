<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClientRegisterLink extends Model
{
    use HasUlids;

    protected $table = 'clients_register_links';
    protected $fillable = [
        'organization_id',
        'title', 'max_registers', 'used_registers',
        'require_address', 'require_guardian_if_minor', 'default_assignments',
    ];

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    protected function casts(): array
    {
        return [
            'default_assignments' => 'array',
            'default_assignments.*' => 'integer',
        ];
    }
}
