<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Announcement extends Model
{
    protected $fillable = [
        'title', 'content', 'type', 'priority',
        'target_roles', 'target_areas',
        'is_push_notification', 'is_sms_notification', 'is_email_notification',
        'is_active', 'published_at', 'expires_at', 'created_by',
    ];

    protected $casts = [
        'target_roles' => 'json',
        'target_areas' => 'json',
        'is_push_notification' => 'boolean',
        'is_sms_notification' => 'boolean',
        'is_email_notification' => 'boolean',
        'is_active' => 'boolean',
        'published_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
