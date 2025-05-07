<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spaces', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('vehicle_type');
            $table->decimal('price_per_hour', 10, 2);
            $table->integer('total_spaces');
            $table->integer('available_spaces')->nullable();
            $table->time('start_time'); // Nueva columna para la hora de inicio
            $table->time('end_time');   // Nueva columna para la hora de fin
            $table->boolean('active')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spaces');
    }
};
