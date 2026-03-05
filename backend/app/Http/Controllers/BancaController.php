<?php

namespace App\Http\Controllers;

use App\Models\Banca;
use Illuminate\Http\Request;

class BancaController extends Controller
{
    public function index()
    {
        return response()->json(Banca::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:255',
            'balance' => 'numeric',
            'status' => 'string'
        ]);

        $banca = Banca::create($validated);
        return response()->json($banca, 201);
    }

    public function show($id)
    {
        $banca = Banca::find($id);
        if (!$banca) {
            return response()->json(['message' => 'Banca not found'], 404);
        }
        return response()->json($banca, 200);
    }

    public function update(Request $request, $id)
    {
        $banca = Banca::find($id);
        if (!$banca) {
            return response()->json(['message' => 'Banca not found'], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'address' => 'nullable|string|max:255',
            'balance' => 'numeric',
            'status' => 'string'
        ]);

        $banca->update($validated);
        return response()->json($banca, 200);
    }

    public function destroy($id)
    {
        $banca = Banca::find($id);
        if (!$banca) {
            return response()->json(['message' => 'Banca not found'], 404);
        }

        $banca->delete();
        return response()->json(['message' => 'Banca deleted'], 200);
    }
}
