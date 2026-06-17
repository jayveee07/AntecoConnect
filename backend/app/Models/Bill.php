<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Bill extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'consumer_account_id', 'bill_number', 'billing_period',
        'billing_date', 'due_date', 'disconnection_date',
        'previous_reading', 'current_reading', 'consumption_kwh',
        'previous_reading_date', 'current_reading_date', 'consumption_days',
        'generation_charge', 'transmission_charge', 'system_loss_charge',
        'distribution_charge', 'subsidies_charge', 'lifeline_discount',
        'senior_discount', 'vat', 'franchise_tax', 'penalty',
        'other_charges', 'total_amount_due', 'amount_paid', 'balance',
        'status', 'payment_status', 'paid_at', 'payment_method',
        'payment_reference', 'is_read', 'notes', 'metadata',
    ];

    protected $casts = [
        'billing_date' => 'date',
        'due_date' => 'date',
        'disconnection_date' => 'date',
        'previous_reading_date' => 'date',
        'current_reading_date' => 'date',
        'paid_at' => 'datetime',
        'previous_reading' => 'decimal:2',
        'current_reading' => 'decimal:2',
        'consumption_kwh' => 'decimal:2',
        'total_amount_due' => 'decimal:2',
        'amount_paid' => 'decimal:2',
        'balance' => 'decimal:2',
        'is_read' => 'boolean',
        'metadata' => 'json',
    ];

    public function consumerAccount(): BelongsTo
    {
        return $this->belongsTo(ConsumerAccount::class);
    }

    public function readings(): HasMany
    {
        return $this->hasMany(BillReading::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function isOverdue(): bool
    {
        return $this->status === 'unpaid' && $this->due_date < now();
    }

    public function getDaysUntilDueAttribute(): int
    {
        return now()->diffInDays($this->due_date, false);
    }
}
