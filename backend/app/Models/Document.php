<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Document extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'document_number', 'documentable_type', 'documentable_id',
        'type', 'category', 'file_name', 'file_path', 'mime_type',
        'file_size', 'description', 'is_verified', 'verified_at',
        'verified_by', 'expiry_date',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'verified_at' => 'datetime',
        'expiry_date' => 'date',
        'file_size' => 'integer',
    ];

    public function documentable(): MorphTo
    {
        return $this->morphTo();
    }
}
