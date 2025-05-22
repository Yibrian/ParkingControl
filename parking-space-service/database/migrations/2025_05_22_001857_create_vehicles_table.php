<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id'); // Cliente dueño del vehículo
            $table->string('plate')->unique();
            $table->string('type'); // Carro, Moto, etc.
            $table->boolean('is_default')->default(false);
            $table->timestamps();

            // Si tienes usuarios en otro microservicio, puedes omitir la foreign key
            // $table->foreign('user_id')->references('id')->on('users');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};