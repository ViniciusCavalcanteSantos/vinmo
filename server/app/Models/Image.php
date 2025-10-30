<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Support\Facades\Storage;

class Image extends Model
{
    use HasUlids;

    protected $fillable = [
        'imageable_id',
        'imageable_type',
        'parent_id',
        'disk',
        'path',
        'type',
        'size',
        'mime_type',
        'hash',
    ];


    public function imageable(): MorphTo
    {
        return $this->morphTo();
    }

    public function versions(): HasMany
    {
        return $this->hasMany(Image::class, 'parent_id');
    }

    public function original(): BelongsTo
    {
        return $this->belongsTo(Image::class, 'parent_id');
    }

    public function getUrlAttribute(): string
    {
        if (config('app.image_proxy')) {
            return route('images.proxy', ['id' => $this->id]);
        }

        return Storage::disk($this->disk)->url($this->path);
    }

    public function getVersion(string $type): ?self
    {
        return $this->versions->firstWhere('type', $type);
    }

    public function clientImageLinks(): HasMany
    {
        return $this->hasMany(FaceDetection::class);
    }

    public function clientsInImage()
    {
        return $this
            ->belongsToMany(Client::class, 'clients_event_image_links')
            ->withPivot(['event_id', 'matched_by', 'confidence', 'is_active'])
            ->withTimestamps();
    }
}
