<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentGateway extends Model
{
    protected $fillable = [
        'code', 'name', 'type', 'is_active',
        'fee_percentage', 'fee_fixed', 'config', 'sort_order',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'fee_percentage' => 'decimal:2',
        'fee_fixed' => 'decimal:2',
        'config' => 'json',
        'sort_order' => 'integer',
    ];
}
