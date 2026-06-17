<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('service_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number', 20)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('consumer_account_id')->nullable()->constrained()->onDelete('set null');

            $table->string('type');
            // new_connection, reconnection, change_ownership, meter_transfer,
            // service_upgrade, temporary_connection, meter_calibration, others

            $table->string('status'); // draft, submitted, under_review, approved, rejected, completed, cancelled

            // Requirements
            $table->json('requirements')->nullable();
            $table->json('attachments')->nullable();

            // Schedule
            $table->date('preferred_date')->nullable();
            $table->string('preferred_time')->nullable();
            $table->date('scheduled_date')->nullable();
            $table->date('completed_date')->nullable();

            // Assignment
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->text('remarks')->nullable();
            $table->text('admin_notes')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->index(['user_id', 'status']);
        });

        Schema::create('support_tickets', function (Blueprint $table) {
            $table->id();
            $table->string('ticket_number', 20)->unique();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('category'); // billing, technical, account, others
            $table->string('subject');
            $table->text('description');
            $table->string('priority'); // low, medium, high, urgent
            $table->string('status'); // open, in_progress, waiting_on_customer, resolved, closed
            $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
            $table->json('attachments')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('ticket_messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ticket_id')->constrained('support_tickets')->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->text('message');
            $table->json('attachments')->nullable();
            $table->boolean('is_staff_reply')->default(false);
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->id();
            $table->string('category');
            $table->string('question');
            $table->text('answer');
            $table->boolean('is_published')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faqs');
        Schema::dropIfExists('ticket_messages');
        Schema::dropIfExists('support_tickets');
        Schema::dropIfExists('service_requests');
    }
};
