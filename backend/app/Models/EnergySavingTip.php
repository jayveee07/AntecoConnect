<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EnergySavingTip extends Model
{
    protected $fillable = [
        'category', 'title', 'description', 'detailed_advice',
        'estimated_savings_percent', 'difficulty',
        'tags', 'is_active', 'sort_order',
    ];

    protected $casts = [
        'estimated_savings_percent' => 'decimal:2',
        'tags' => 'json',
        'is_active' => 'boolean',
        'sort_order' => 'integer',
    ];
}
