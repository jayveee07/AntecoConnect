<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('consumer_accounts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('account_number', 20)->unique();
            $table->string('meter_number', 30)->unique();
            $table->string('service_address');
            $table->string('connection_type'); // residential, commercial, industrial
            $table->string('phase_type'); // single-phase, three-phase
            $table->decimal('voltage', 8, 2)->default(220.00);
            $table->decimal('amperage', 8, 2)->default(30.00);
            $table->decimal('security_deposit', 12, 2)->default(0);
            $table->date('connection_date');
            $table->string('status'); // active, disconnected, pending
            $table->boolean('has_smart_meter')->default(false);
            $table->string('meter_type')->nullable(); // analog, digital, smart
            $table->decimal('meter_multiplier', 10, 2)->default(1.00);
            $table->string('pole_number')->nullable();
            $table->string('transformer_number')->nullable();
            $table->string('feeder')->nullable();
            $table->string('route_code')->nullable();
            $table->integer('sequence_number')->nullable();
            $table->json('additional_info')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('consumer_rates', function (Blueprint $table) {
            $table->id();
            $table->string('rate_code', 20)->unique();
            $table->string('description');
            $table->string('consumer_type');
            $table->decimal('generation_charge', 10, 4);
            $table->decimal('transmission_charge', 10, 4);
            $table->decimal('system_loss_charge', 10, 4);
            $table->decimal('distribution_charge', 10, 4);
            $table->decimal('subsidies_charge', 10, 4);
            $table->decimal('lifeline_discount', 10, 4)->default(0);
            $table->decimal('senior_discount', 10, 4)->default(0);
            $table->decimal('vat_rate', 10, 4)->default(12.00);
            $table->decimal('franchise_tax', 10, 4)->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('consumer_rates');
        Schema::dropIfExists('consumer_accounts');
    }
};
