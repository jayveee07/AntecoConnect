<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('electric_poles', function (Blueprint $table) {
            $table->id();
            $table->string('pole_number', 30)->unique();
            $table->string('pole_type'); // concrete, steel, wood
            $table->string('latitude', 20);
            $table->string('longitude', 20);
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('status'); // active, damaged, removed
            $table->string('feeder')->nullable();
            $table->string('transformer_number')->nullable();
            $table->text('notes')->nullable();
            $table->json('equipment')->nullable();
            $table->timestamps();
        });

        Schema::create('transformers', function (Blueprint $table) {
            $table->id();
            $table->string('transformer_number', 30)->unique();
            $table->string('type'); // distribution, power
            $table->string('capacity_kva', 20);
            $table->string('voltage_primary', 20);
            $table->string('voltage_secondary', 20);
            $table->string('phase_type'); // single, three
            $table->string('latitude', 20);
            $table->string('longitude', 20);
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->string('pole_number');
            $table->string('feeder');
            $table->string('status'); // active, overloaded, faulty, decommissioned
            $table->date('installation_date');
            $table->date('last_maintenance_date')->nullable();
            $table->integer('consumers_served')->default(0);
            $table->json('specifications')->nullable();
            $table->timestamps();
        });

        Schema::create('feeders', function (Blueprint $table) {
            $table->id();
            $table->string('feeder_code', 20)->unique();
            $table->string('name');
            $table->string('substation');
            $table->string('voltage_level', 20);
            $table->decimal('capacity_mva', 10, 2);
            $table->decimal('current_load_mva', 10, 2)->default(0);
            $table->string('status'); // normal, overloaded, under_maintenance
            $table->json('route_geometry')->nullable();
            $table->timestamps();
        });

        Schema::create('service_areas', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('code', 20)->unique();
            $table->string('barangay');
            $table->string('city');
            $table->string('province');
            $table->json('boundaries')->nullable();
            $table->foreignId('assigned_team_id')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('service_areas');
        Schema::dropIfExists('feeders');
        Schema::dropIfExists('transformers');
        Schema::dropIfExists('electric_poles');
    }
};
