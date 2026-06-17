<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bills', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumer_account_id')->constrained()->onDelete('cascade');
            $table->string('bill_number', 30)->unique();
            $table->string('billing_period'); // e.g., "2025-01"
            $table->date('billing_date');
            $table->date('due_date');
            $table->date('disconnection_date')->nullable();

            // Meter Readings
            $table->decimal('previous_reading', 12, 2);
            $table->decimal('current_reading', 12, 2);
            $table->decimal('consumption_kwh', 12, 2);
            $table->date('previous_reading_date');
            $table->date('current_reading_date');
            $table->integer('consumption_days');

            // Charges Breakdown
            $table->decimal('generation_charge', 12, 2)->default(0);
            $table->decimal('transmission_charge', 12, 2)->default(0);
            $table->decimal('system_loss_charge', 12, 2)->default(0);
            $table->decimal('distribution_charge', 12, 2)->default(0);
            $table->decimal('subsidies_charge', 12, 2)->default(0);
            $table->decimal('lifeline_discount', 12, 2)->default(0);
            $table->decimal('senior_discount', 12, 2)->default(0);

            // Taxes and Fees
            $table->decimal('vat', 12, 2)->default(0);
            $table->decimal('franchise_tax', 12, 2)->default(0);
            $table->decimal('penalty', 12, 2)->default(0);
            $table->decimal('other_charges', 12, 2)->default(0);

            // Totals
            $table->decimal('total_amount_due', 12, 2);
            $table->decimal('amount_paid', 12, 2)->default(0);
            $table->decimal('balance', 12, 2)->default(0);

            $table->string('status'); // unpaid, paid, partially_paid, overdue, disputed
            $table->string('payment_status')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('payment_method')->nullable();
            $table->string('payment_reference')->nullable();

            $table->boolean('is_read')->default(false);
            $table->text('notes')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['consumer_account_id', 'billing_period']);
            $table->index('status');
        });

        Schema::create('bill_readings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('bill_id')->constrained()->onDelete('cascade');
            $table->foreignId('meter_reader_id')->nullable()->constrained('users')->onDelete('set null');
            $table->decimal('reading_value', 12, 2);
            $table->string('reading_type'); // previous, current
            $table->string('source'); // manual, smart_meter, estimated
            $table->string('meter_photo')->nullable();
            $table->decimal('gps_latitude', 10, 7)->nullable();
            $table->decimal('gps_longitude', 10, 7)->nullable();
            $table->string('status'); // pending, validated, rejected
            $table->text('remarks')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bill_readings');
        Schema::dropIfExists('bills');
    }
};
