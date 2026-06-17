<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Feeder extends Model
{
    protected $fillable = [
        'feeder_code', 'name', 'substation', 'voltage_level',
        'capacity_mva', 'current_load_mva', 'status', 'route_geometry',
    ];

    protected $casts = [
        'capacity_mva' => 'decimal:2',
        'current_load_mva' => 'decimal:2',
        'route_geometry' => 'json',
    ];
}
