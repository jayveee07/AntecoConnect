<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceRequest extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'request_number', 'user_id', 'consumer_account_id', 'type', 'status',
        'requirements', 'attachments', 'preferred_date', 'preferred_time',
        'scheduled_date', 'completed_date', 'assigned_to', 'remarks', 'admin_notes',
    ];

    protected $casts = [
        'preferred_date' => 'date',
        'scheduled_date' => 'date',
        'completed_date' => 'date',
        'requirements' => 'json',
        'attachments' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function consumerAccount(): BelongsTo
    {
        return $this->belongsTo(ConsumerAccount::class);
    }

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
}
