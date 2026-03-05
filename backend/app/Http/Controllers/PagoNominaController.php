<?php

namespace App\Http\Controllers;

use App\Models\PagoNomina;
use Illuminate\Http\Request;

class PagoNominaController extends Controller
{
    public function index()
    {
        return response()->json(PagoNomina::with(['empleado', 'banca'])->orderBy('created_at', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'empleado_id' => 'required|exists:empleados,id',
            'banca_id' => 'nullable|exists:bancas,id',
            'month_year' => 'required|string|max:10',
            'payment_date' => 'required|date',
            'base_salary' => 'required|numeric|min:0',
            'ars_deduction' => 'nullable|numeric|min:0',
            'afp_deduction' => 'nullable|numeric|min:0',
            'other_deductions' => 'nullable|numeric|min:0',
            'deductions' => 'required|numeric|min:0',
            'bonuses' => 'required|numeric|min:0',
            'net_pay' => 'required|numeric|min:0',
            'status' => 'required|string|max:20',
        ]);

        $pago = PagoNomina::create($validatedData);

        return response()->json($pago->load(['empleado', 'banca']), 201);
    }

    public function show($id)
    {
        $pago = PagoNomina::with(['empleado', 'banca'])->find($id);
        if (!$pago) {
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }
        return response()->json($pago);
    }

    public function update(Request $request, $id)
    {
        $pago = PagoNomina::find($id);
        if (!$pago) {
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'empleado_id' => 'sometimes|exists:empleados,id',
            'banca_id' => 'nullable|exists:bancas,id',
            'month_year' => 'sometimes|string|max:10',
            'payment_date' => 'sometimes|date',
            'base_salary' => 'sometimes|numeric|min:0',
            'ars_deduction' => 'nullable|numeric|min:0',
            'afp_deduction' => 'nullable|numeric|min:0',
            'other_deductions' => 'nullable|numeric|min:0',
            'deductions' => 'sometimes|numeric|min:0',
            'bonuses' => 'sometimes|numeric|min:0',
            'net_pay' => 'sometimes|numeric|min:0',
            'status' => 'sometimes|string|max:20',
        ]);

        $pago->update($validatedData);

        return response()->json($pago->load(['empleado', 'banca']));
    }

    public function destroy($id)
    {
        $pago = PagoNomina::find($id);
        if (!$pago) {
            return response()->json(['message' => 'Pago no encontrado'], 404);
        }

        $pago->delete();

        return response()->json(['message' => 'Pago eliminado permanentemente']);
    }
}
