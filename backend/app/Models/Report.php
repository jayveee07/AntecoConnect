<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Report extends Model
{
    protected $fillable = [
        'report_number', 'type', 'format', 'status',
        'parameters', 'file_path', 'generated_by', 'generated_at', 'expires_at',
    ];

    protected $casts = [
        'parameters' => 'json',
        'generated_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }
}
