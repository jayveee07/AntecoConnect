<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InterruptionNotice extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title', 'type', 'description', 'affected_areas',
        'start_time', 'end_time', 'status', 'reason', 'updates', 'created_by',
    ];

    protected $casts = [
        'start_time' => 'datetime',
        'end_time' => 'datetime',
        'affected_areas' => 'json',
        'updates' => 'json',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
