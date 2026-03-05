<?php

namespace App\Http\Controllers;

use App\Models\Empleado;
use Illuminate\Http\Request;

class EmpleadoController extends Controller
{
    public function index()
    {
        // Return all employees with their associated 'banca' if you like: Empleado::with('banca')->get()
        return response()->json(Empleado::with('banca')->get(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'role' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'string',
            'banca_id' => 'nullable|exists:bancas,id'
        ]);

        $empleado = Empleado::create($validated);
        // Load banca relation before returning if needed
        $empleado->load('banca');

        return response()->json($empleado, 201);
    }

    public function show($id)
    {
        $empleado = Empleado::with('banca')->find($id);
        if (!$empleado) {
            return response()->json(['message' => 'Empleado not found'], 404);
        }
        return response()->json($empleado, 200);
    }

    public function update(Request $request, $id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['message' => 'Empleado not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'role' => 'sometimes|required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'status' => 'string',
            'banca_id' => 'nullable|exists:bancas,id'
        ]);

        $empleado->update($validated);
        $empleado->load('banca');

        return response()->json($empleado, 200);
    }

    public function destroy($id)
    {
        $empleado = Empleado::find($id);
        if (!$empleado) {
            return response()->json(['message' => 'Empleado not found'], 404);
        }

        $empleado->delete();
        return response()->json(['message' => 'Empleado deleted'], 200);
    }
}
