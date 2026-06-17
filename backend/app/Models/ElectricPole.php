<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ElectricPole extends Model
{
    protected $fillable = [
        'pole_number', 'pole_type', 'latitude', 'longitude',
        'barangay', 'city', 'province', 'status',
        'feeder', 'transformer_number', 'notes', 'equipment',
    ];

    protected $casts = [
        'equipment' => 'json',
    ];
}
