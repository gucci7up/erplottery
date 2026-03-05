<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('operaciones', function (Blueprint $table) {
            $table->id();
            $table->foreignId('banca_id')->constrained('bancas')->onDelete('cascade');
            $table->date('operation_date');
            $table->decimal('ventas_brutas', 12, 2)->default(0);
            $table->decimal('premios_pagados', 12, 2)->default(0);
            $table->decimal('gastos_banca', 12, 2)->default(0);
            $table->decimal('balance_neto', 12, 2)->default(0);
            $table->timestamps();

            // Unq index so we only have one summary operation per banca per day
            $table->unique(['banca_id', 'operation_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('operaciones');
    }
};
