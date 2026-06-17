<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WorkOrder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'work_order_number', 'type', 'priority', 'status',
        'assigned_to', 'supervisor_id', 'consumer_account_id',
        'service_request_id', 'outage_id', 'address', 'barangay',
        'city', 'province', 'latitude', 'longitude',
        'scheduled_start', 'scheduled_end', 'started_at', 'completed_at',
        'description', 'notes', 'completion_notes',
        'before_photos', 'after_photos',
        'customer_name', 'customer_contact', 'customer_signature',
        'equipment_used', 'labor_cost', 'parts_cost', 'total_cost',
    ];

    protected $casts = [
        'scheduled_start' => 'datetime',
        'scheduled_end' => 'datetime',
        'started_at' => 'datetime',
        'completed_at' => 'datetime',
        'before_photos' => 'json',
        'after_photos' => 'json',
        'equipment_used' => 'json',
        'labor_cost' => 'decimal:2',
        'parts_cost' => 'decimal:2',
        'total_cost' => 'decimal:2',
    ];

    public function assignedTo(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }

    public function supervisor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'supervisor_id');
    }

    public function consumerAccount(): BelongsTo
    {
        return $this->belongsTo(ConsumerAccount::class);
    }

    public function serviceRequest(): BelongsTo
    {
        return $this->belongsTo(ServiceRequest::class);
    }

    public function outage(): BelongsTo
    {
        return $this->belongsTo(Outage::class);
    }
}
