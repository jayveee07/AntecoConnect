<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ConsumerRate extends Model
{
    protected $fillable = [
        'rate_code', 'description', 'consumer_type',
        'generation_charge', 'transmission_charge', 'system_loss_charge',
        'distribution_charge', 'subsidies_charge',
        'lifeline_discount', 'senior_discount',
        'vat_rate', 'franchise_tax', 'is_active',
    ];

    protected $casts = [
        'generation_charge' => 'decimal:4',
        'transmission_charge' => 'decimal:4',
        'system_loss_charge' => 'decimal:4',
        'distribution_charge' => 'decimal:4',
        'subsidies_charge' => 'decimal:4',
        'lifeline_discount' => 'decimal:4',
        'senior_discount' => 'decimal:4',
        'vat_rate' => 'decimal:4',
        'is_active' => 'boolean',
    ];
}
