<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ConsumerAccount extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id', 'account_number', 'meter_number', 'service_address',
        'connection_type', 'phase_type', 'voltage', 'amperage',
        'security_deposit', 'connection_date', 'status',
        'has_smart_meter', 'meter_type', 'meter_multiplier',
        'pole_number', 'transformer_number', 'feeder',
        'route_code', 'sequence_number', 'additional_info',
    ];

    protected $casts = [
        'connection_date' => 'date',
        'has_smart_meter' => 'boolean',
        'security_deposit' => 'decimal:2',
        'voltage' => 'decimal:2',
        'amperage' => 'decimal:2',
        'meter_multiplier' => 'decimal:2',
        'additional_info' => 'json',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bills(): HasMany
    {
        return $this->hasMany(Bill::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    public function consumptionData(): HasMany
    {
        return $this->hasMany(ConsumptionData::class);
    }

    public function getCurrentBillAttribute()
    {
        return $this->bills()->where('status', 'unpaid')->latest()->first();
    }

    public function getLatestBillAttribute()
    {
        return $this->bills()->latest()->first();
    }
}
