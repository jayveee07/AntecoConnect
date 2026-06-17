<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transformer extends Model
{
    protected $fillable = [
        'transformer_number', 'type', 'capacity_kva',
        'voltage_primary', 'voltage_secondary', 'phase_type',
        'latitude', 'longitude', 'barangay', 'city', 'province',
        'pole_number', 'feeder', 'status', 'installation_date',
        'last_maintenance_date', 'consumers_served', 'specifications',
    ];

    protected $casts = [
        'installation_date' => 'date',
        'last_maintenance_date' => 'date',
        'consumers_served' => 'integer',
        'specifications' => 'json',
    ];
}
