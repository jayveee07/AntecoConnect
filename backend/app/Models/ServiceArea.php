<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ServiceArea extends Model
{
    protected $fillable = [
        'name', 'code', 'barangay', 'city', 'province',
        'boundaries', 'assigned_team_id',
    ];

    protected $casts = [
        'boundaries' => 'json',
    ];

    public function assignedTeam(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_team_id');
    }
}
