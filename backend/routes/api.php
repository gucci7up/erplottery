<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;
use App\Http\Controllers\BancaController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\PagoNominaController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\OperacionController;
use App\Http\Controllers\SettingController;

Route::apiResource('bancas', BancaController::class);
Route::apiResource('empleados', EmpleadoController::class);
Route::apiResource('pagos-nomina', PagoNominaController::class);
Route::apiResource('gastos', GastoController::class);
Route::apiResource('operaciones', OperacionController::class);

// Settings
Route::get('settings', [SettingController::class, 'index']);
Route::post('settings', [SettingController::class, 'update']);
Route::post('settings/logo', [SettingController::class, 'uploadLogo']);

// Profile & Password
Route::post('profile', [\App\Http\Controllers\ProfileController::class, 'update']);
Route::post('profile/password', [\App\Http\Controllers\ProfileController::class, 'changePassword']);

// Serve Files securely via API proxy
Route::get('storage/logos/{filename}', function ($filename) {
    if (!\Illuminate\Support\Facades\Storage::disk('public')->exists('logos/' . $filename)) {
        abort(404);
    }
    return response()->file(\Illuminate\Support\Facades\Storage::disk('public')->path('logos/' . $filename));
});

// Backup
Route::get('backup', [\App\Http\Controllers\BackupController::class, 'download']);
