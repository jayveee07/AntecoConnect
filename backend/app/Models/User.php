<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable, HasRoles, SoftDeletes;

    protected $fillable = [
        'consumer_code', 'first_name', 'middle_name', 'last_name',
        'email', 'mobile_number', 'password', 'address_line1', 'address_line2',
        'barangay', 'city', 'province', 'zip_code', 'latitude', 'longitude',
        'profile_photo', 'is_active', 'is_verified', 'otp_code', 'otp_expires_at',
        'fcm_token',
    ];

    protected $hidden = [
        'password', 'remember_token', 'otp_code', 'otp_expires_at',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'mobile_verified_at' => 'datetime',
        'is_active' => 'boolean',
        'is_verified' => 'boolean',
        'otp_expires_at' => 'datetime',
    ];

    public function consumerAccount(): HasOne
    {
        return $this->hasOne(ConsumerAccount::class);
    }

    public function outages(): HasMany
    {
        return $this->hasMany(Outage::class, 'reported_by');
    }

    public function serviceRequests(): HasMany
    {
        return $this->hasMany(ServiceRequest::class);
    }

    public function supportTickets(): HasMany
    {
        return $this->hasMany(SupportTicket::class);
    }

    public function workOrders(): HasMany
    {
        return $this->hasMany(WorkOrder::class, 'assigned_to');
    }

    public function getFullNameAttribute(): string
    {
        $name = $this->first_name;
        if ($this->middle_name) {
            $name .= ' ' . $this->middle_name;
        }
        $name .= ' ' . $this->last_name;
        return $name;
    }

    public function getFullAddressAttribute(): string
    {
        $address = $this->address_line1;
        if ($this->address_line2) {
            $address .= ', ' . $this->address_line2;
        }
        $address .= ', ' . $this->barangay;
        $address .= ', ' . $this->city;
        $address .= ', ' . $this->province;
        return $address;
    }
}
