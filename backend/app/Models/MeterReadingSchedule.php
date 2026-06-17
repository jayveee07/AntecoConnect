<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MeterReadingSchedule extends Model
{
    protected $fillable = [
        'meter_reader_id', 'reading_date', 'route_code',
        'assigned_meters', 'status', 'total_meters', 'read_meters',
    ];

    protected $casts = [
        'reading_date' => 'date',
        'assigned_meters' => 'json',
        'total_meters' => 'integer',
        'read_meters' => 'integer',
    ];

    public function meterReader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'meter_reader_id');
    }
}
