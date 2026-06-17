<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consumption_data', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumer_account_id')->constrained()->onDelete('cascade');

            // Time period
            $table->string('period_type'); // daily, weekly, monthly, yearly
            $table->date('period_date');
            $table->integer('period_year');
            $table->integer('period_month')->nullable();
            $table->integer('period_week')->nullable();
            $table->integer('period_day')->nullable();

            $table->decimal('consumption_kwh', 12, 2);
            $table->decimal('peak_consumption', 12, 2)->nullable();
            $table->decimal('off_peak_consumption', 12, 2)->nullable();
            $table->integer('reading_days')->nullable();
            $table->decimal('average_daily_kwh', 10, 2)->nullable();

            $table->decimal('estimated_cost', 12, 2)->nullable();

            $table->string('status'); // actual, estimated, projected
            $table->json('hourly_data')->nullable();

            $table->timestamps();

            $table->unique(['consumer_account_id', 'period_type', 'period_date']);
            $table->index(['consumer_account_id', 'period_year', 'period_month']);
        });

        Schema::create('ai_predictions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumer_account_id')->constrained()->onDelete('cascade');
            $table->string('prediction_type'); // bill_forecast, consumption_forecast, peak_usage, revenue_forecast
            $table->string('period'); // next_month, next_quarter, next_year
            $table->decimal('predicted_value', 12, 2);
            $table->decimal('confidence_score', 5, 2)->nullable();
            $table->json('factors')->nullable();
            $table->json('recommendations')->nullable();
            $table->date('prediction_date');
            $table->date('valid_until')->nullable();
            $table->timestamps();
        });

        Schema::create('energy_saving_tips', function (Blueprint $table) {
            $table->id();
            $table->string('category'); // appliance, lighting, cooling, general
            $table->string('title');
            $table->text('description');
            $table->text('detailed_advice')->nullable();
            $table->decimal('estimated_savings_percent', 5, 2)->nullable();
            $table->string('difficulty'); // easy, moderate, advanced
            $table->json('tags')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('energy_saving_tips');
        Schema::dropIfExists('ai_predictions');
        Schema::dropIfExists('consumption_data');
    }
};
