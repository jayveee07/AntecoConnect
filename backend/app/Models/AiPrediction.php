<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiPrediction extends Model
{
    protected $fillable = [
        'consumer_account_id', 'prediction_type', 'period',
        'predicted_value', 'confidence_score', 'factors',
        'recommendations', 'prediction_date', 'valid_until',
    ];

    protected $casts = [
        'predicted_value' => 'decimal:2',
        'confidence_score' => 'decimal:2',
        'factors' => 'json',
        'recommendations' => 'json',
        'prediction_date' => 'date',
        'valid_until' => 'date',
    ];

    public function consumerAccount(): BelongsTo
    {
        return $this->belongsTo(ConsumerAccount::class);
    }
}
