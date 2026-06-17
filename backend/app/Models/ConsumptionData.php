<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ConsumptionData extends Model
{
    protected $fillable = [
        'consumer_account_id', 'period_type', 'period_date',
        'period_year', 'period_month', 'period_week', 'period_day',
        'consumption_kwh', 'peak_consumption', 'off_peak_consumption',
        'reading_days', 'average_daily_kwh', 'estimated_cost',
        'status', 'hourly_data',
    ];

    protected $casts = [
        'period_date' => 'date',
        'consumption_kwh' => 'decimal:2',
        'peak_consumption' => 'decimal:2',
        'off_peak_consumption' => 'decimal:2',
        'average_daily_kwh' => 'decimal:2',
        'estimated_cost' => 'decimal:2',
        'hourly_data' => 'json',
    ];

    public function consumerAccount(): BelongsTo
    {
        return $this->belongsTo(ConsumerAccount::class);
    }
}
