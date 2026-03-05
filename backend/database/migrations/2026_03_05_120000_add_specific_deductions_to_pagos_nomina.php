<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('pagos_nomina', function (Blueprint $table) {
            $table->decimal('ars_deduction', 10, 2)->default(0)->after('base_salary');
            $table->decimal('afp_deduction', 10, 2)->default(0)->after('ars_deduction');
            $table->decimal('other_deductions', 10, 2)->default(0)->after('afp_deduction');
            // Retain the existing generic 'deductions' column to hold the sum or legacy data.
        });
    }

    public function down(): void
    {
        Schema::table('pagos_nomina', function (Blueprint $table) {
            $table->dropColumn(['ars_deduction', 'afp_deduction', 'other_deductions']);
        });
    }
};
