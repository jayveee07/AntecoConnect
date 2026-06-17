<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('outages', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 20)->unique();
            $table->foreignId('reported_by')->constrained('users')->onDelete('cascade');

            // Type
            $table->string('type'); // power_outage, low_voltage, high_voltage, broken_meter, fallen_pole, transformer_issue, others

            // Location
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->text('street_address');
            $table->string('landmark')->nullable();
            $table->string('latitude', 20);
            $table->string('longitude', 20);

            // Details
            $table->text('description');
            $table->string('priority'); // low, medium, high, critical
            $table->string('status'); // reported, verified, assigned, in_progress, resolved, closed

            // Affected
            $table->integer('affected_consumers')->nullable();
            $table->string('affected_area')->nullable();
            $table->string('cause')->nullable(); // weather, equipment_failure, vehicle_accident, maintenance, unknown

            // Resolution
            $table->foreignId('assigned_team_id')->nullable()->constrained('users')->onDelete('set null');
            $table->datetime('estimated_restoration')->nullable();
            $table->datetime('restored_at')->nullable();
            $table->text('resolution_notes')->nullable();

            $table->json('photos')->nullable();
            $table->json('updates')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status', 'priority']);
            $table->index('barangay');
        });

        Schema::create('interruption_notices', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('type'); // scheduled, emergency
            $table->text('description');
            $table->json('affected_areas');
            $table->datetime('start_time');
            $table->datetime('end_time');
            $table->string('status'); // upcoming, ongoing, completed, cancelled
            $table->string('reason');
            $table->json('updates')->nullable();
            $table->foreignId('created_by')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('interruption_notices');
        Schema::dropIfExists('outages');
    }
};
