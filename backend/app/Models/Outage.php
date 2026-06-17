<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Outage extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'ticket_number', 'reported_by', 'type', 'barangay', 'city', 'province',
        'street_address', 'landmark', 'latitude', 'longitude', 'description',
        'priority', 'status', 'affected_consumers', 'affected_area', 'cause',
        'assigned_team_id', 'estimated_restoration', 'restored_at',
        'resolution_notes', 'photos', 'updates',
    ];

    protected $casts = [
        'estimated_restoration' => 'datetime',
        'restored_at' => 'datetime',
        'photos' => 'json',
        'updates' => 'json',
        'affected_consumers' => 'integer',
    ];

    public function reporter(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reported_by');
    }

    public function assignedTeam(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_team_id');
    }

    public function scopeCritical($query)
    {
        return $query->where('priority', 'critical');
    }

    public function scopeActive($query)
    {
        return $query->whereIn('status', ['reported', 'verified', 'assigned', 'in_progress']);
    }
}
