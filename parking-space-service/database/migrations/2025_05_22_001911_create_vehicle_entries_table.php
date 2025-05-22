<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicle_entries', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('reservation_id')->nullable();
            $table->unsignedBigInteger('vehicle_id');
            $table->unsignedBigInteger('space_id');
            $table->dateTime('entry_time');
            $table->dateTime('exit_time')->nullable();
            $table->timestamps();

            // $table->foreign('reservation_id')->references('id')->on('reservations');
            // $table->foreign('vehicle_id')->references('id')->on('vehicles');
            // $table->foreign('space_id')->references('id')->on('spaces');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicle_entries');
    }
};