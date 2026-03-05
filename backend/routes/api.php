<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BancaController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\PagoNominaController;
use App\Http\Controllers\GastoController;
use App\Http\Controllers\OperacionController;

Route::apiResource('bancas', BancaController::class);
Route::apiResource('empleados', EmpleadoController::class);
Route::apiResource('pagos-nomina', PagoNominaController::class);
Route::apiResource('gastos', GastoController::class);
Route::apiResource('operaciones', OperacionController::class);
