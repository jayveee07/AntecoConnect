<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_orders', function (Blueprint $table) {
            $table->id();
            $table->string('work_order_number', 20)->unique();
            $table->string('type');
            // meter_reading, meter_installation, meter_replacement, meter_removal,
            // reconnection, disconnection, service_installation, repair, maintenance, inspection

            $table->string('priority'); // routine, urgent, emergency
            $table->string('status');
            // pending, assigned, in_progress, completed, cancelled, on_hold

            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');

            $table->foreignId('consumer_account_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('service_request_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('outage_id')->nullable()->constrained()->onDelete('set null');

            // Location
            $table->string('address');
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('latitude', 20)->nullable();
            $table->string('longitude', 20)->nullable();

            // Schedule
            $table->datetime('scheduled_start')->nullable();
            $table->datetime('scheduled_end')->nullable();
            $table->datetime('started_at')->nullable();
            $table->datetime('completed_at')->nullable();

            // Details
            $table->text('description');
            $table->text('notes')->nullable();
            $table->text('completion_notes')->nullable();
            $table->json('before_photos')->nullable();
            $table->json('after_photos')->nullable();

            // Customer
            $table->string('customer_name')->nullable();
            $table->string('customer_contact')->nullable();
            $table->string('customer_signature')->nullable();

            // Equipment
            $table->json('equipment_used')->nullable();
            $table->decimal('labor_cost', 12, 2)->nullable();
            $table->decimal('parts_cost', 12, 2)->nullable();
            $table->decimal('total_cost', 12, 2)->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['assigned_to', 'status']);
            $table->index('status');
        });

        Schema::create('meter_reading_schedule', function (Blueprint $table) {
            $table->id();
            $table->foreignId('meter_reader_id')->constrained('users')->onDelete('cascade');
            $table->date('reading_date');
            $table->string('route_code');
            $table->json('assigned_meters');
            $table->string('status'); // pending, in_progress, completed
            $table->integer('total_meters')->default(0);
            $table->integer('read_meters')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('meter_reading_schedule');
        Schema::dropIfExists('work_orders');
    }
};
