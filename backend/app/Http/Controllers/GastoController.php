<?php

namespace App\Http\Controllers;

use App\Models\Gasto;
use Illuminate\Http\Request;

class GastoController extends Controller
{
    public function index()
    {
        return response()->json(Gasto::with('banca')->orderBy('expense_date', 'desc')->get());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'description' => 'required|string|max:255',
            'category' => 'required|string|max:50',
            'amount' => 'required|numeric|min:0',
            'expense_date' => 'required|date',
            'banca_id' => 'nullable|exists:bancas,id',
        ]);

        $gasto = Gasto::create($validatedData);

        return response()->json($gasto->load('banca'), 201);
    }

    public function show($id)
    {
        $gasto = Gasto::with('banca')->find($id);
        if (!$gasto) {
            return response()->json(['message' => 'Gasto no encontrado'], 404);
        }
        return response()->json($gasto);
    }

    public function update(Request $request, $id)
    {
        $gasto = Gasto::find($id);
        if (!$gasto) {
            return response()->json(['message' => 'Gasto no encontrado'], 404);
        }

        $validatedData = $request->validate([
            'description' => 'sometimes|string|max:255',
            'category' => 'sometimes|string|max:50',
            'amount' => 'sometimes|numeric|min:0',
            'expense_date' => 'sometimes|date',
            'banca_id' => 'nullable|exists:bancas,id',
        ]);

        $gasto->update($validatedData);

        return response()->json($gasto->load('banca'));
    }

    public function destroy($id)
    {
        $gasto = Gasto::find($id);
        if (!$gasto) {
            return response()->json(['message' => 'Gasto no encontrado'], 404);
        }

        $gasto->delete();

        return response()->json(['message' => 'Gasto eliminado']);
    }
}
