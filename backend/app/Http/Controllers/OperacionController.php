<?php

namespace App\Http\Controllers;

use App\Models\Operacion;
use Illuminate\Http\Request;

class OperacionController extends Controller
{
    public function index()
    {
        return response()->json(Operacion::with('banca')->orderBy('operation_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'banca_id' => 'required|exists:bancas,id',
            'operation_date' => 'required|date',
            'ventas_brutas' => 'required|numeric|min:0',
            'premios_pagados' => 'required|numeric|min:0',
            'gastos_banca' => 'required|numeric|min:0',
            'balance_neto' => 'required|numeric',
        ]);

        $operacion = Operacion::create($validatedData);

        return response()->json($operacion->load('banca'), 201);
    }

    public function show($id)
    {
        $operacion = Operacion::with('banca')->find($id);
        if (!$operacion) {
            return response()->json(['message' => 'Operación no encontrada'], 404);
        }
        return response()->json($operacion);
    }

    public function update(Request $request, $id)
    {
        $operacion = Operacion::find($id);
        if (!$operacion) {
            return response()->json(['message' => 'Operación no encontrada'], 404);
        }

        $validatedData = $request->validate([
            'banca_id' => 'sometimes|exists:bancas,id',
            'operation_date' => 'sometimes|date',
            'ventas_brutas' => 'sometimes|numeric|min:0',
            'premios_pagados' => 'sometimes|numeric|min:0',
            'gastos_banca' => 'sometimes|numeric|min:0',
            'balance_neto' => 'sometimes|numeric',
        ]);

        $operacion->update($validatedData);

        return response()->json($operacion->load('banca'));
    }

    public function destroy($id)
    {
        $operacion = Operacion::find($id);
        if (!$operacion) {
            return response()->json(['message' => 'Operación no encontrada'], 404);
        }

        $operacion->delete();

        return response()->json(['message' => 'Operación eliminada limitadamente']);
    }
}
