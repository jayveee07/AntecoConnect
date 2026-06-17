<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('consumer_account_id')->constrained()->onDelete('cascade');
            $table->foreignId('bill_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->string('transaction_number', 30)->unique();
            $table->string('type'); // payment, adjustment, refund, deposit
            $table->string('payment_method'); // gcash, maya, bank_transfer, credit_card, cash, check, qr
            $table->string('payment_channel')->nullable(); // online, walk-in, mobile
            $table->decimal('amount', 12, 2);
            $table->decimal('fee', 12, 2)->default(0);
            $table->decimal('net_amount', 12, 2);
            $table->string('reference_number')->nullable();
            $table->string('proof_image')->nullable();
            $table->string('status'); // pending, confirmed, failed, refunded
            $table->text('notes')->nullable();
            $table->json('gateway_response')->nullable();
            $table->timestamp('confirmed_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['consumer_account_id', 'created_at']);
            $table->index('status');
        });

        Schema::create('payment_gateways', function (Blueprint $table) {
            $table->id();
            $table->string('code', 20)->unique(); // gcash, maya, bank_bpi, etc.
            $table->string('name');
            $table->string('type'); // ewallet, bank, card, overthecounter
            $table->boolean('is_active')->default(true);
            $table->decimal('fee_percentage', 5, 2)->default(0);
            $table->decimal('fee_fixed', 10, 2)->default(0);
            $table->json('config')->nullable();
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payment_gateways');
        Schema::dropIfExists('transactions');
    }
};
