<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
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

// Profile & Password
Route::post('profile', [\App\Http\Controllers\ProfileController::class, 'update']);
Route::post('profile/password', [\App\Http\Controllers\ProfileController::class, 'changePassword']);

// Backup
Route::get('backup', [\App\Http\Controllers\BackupController::class, 'download']);
