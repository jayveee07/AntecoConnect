<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BillReading extends Model
{
    protected $table = 'bill_readings';

    protected $fillable = [
        'bill_id', 'meter_reader_id', 'reading_value', 'reading_type',
        'source', 'meter_photo', 'gps_latitude', 'gps_longitude',
        'status', 'remarks',
    ];

    protected $casts = [
        'reading_value' => 'decimal:2',
        'gps_latitude' => 'decimal:7',
        'gps_longitude' => 'decimal:7',
    ];

    public function bill(): BelongsTo
    {
        return $this->belongsTo(Bill::class);
    }

    public function meterReader(): BelongsTo
    {
        return $this->belongsTo(User::class, 'meter_reader_id');
    }
}
