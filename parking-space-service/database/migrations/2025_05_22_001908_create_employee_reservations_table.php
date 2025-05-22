<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('employee_reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('employee_id'); // Empleado que crea la reserva
            $table->unsignedBigInteger('space_id');
            $table->unsignedBigInteger('vehicle_id');
            $table->date('start_date');
            $table->time('start_time');
            $table->date('end_date')->nullable();
            $table->time('end_time')->nullable();
            $table->text('description')->nullable();
            $table->enum('status', ['pendiente', 'confirmada', 'cancelada', 'finalizada'])->default('pendiente');
            $table->timestamps();

            // $table->foreign('space_id')->references('id')->on('spaces');
            // $table->foreign('vehicle_id')->references('id')->on('vehicles');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('employee_reservations');
    }
};