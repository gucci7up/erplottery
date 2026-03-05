<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index()
    {
        // Return settings as a key-value object
        $settings = Setting::all()->pluck('value', 'key');
        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $validatedData = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string'
        ]);

        foreach ($validatedData['settings'] as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        return response()->json(['message' => 'Configuración actualizada exitosamente']);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = time() . '_' . $file->getClientOriginalName();

            // Store the file in public/logos
            $path = $file->storeAs('logos', $filename, 'public');

            // Save the path in settings with /api/ prefix to hit the new proxy route
            $logoUrl = '/api/storage/' . $path;
            Setting::updateOrCreate(['key' => 'company_logo'], ['value' => $logoUrl]);

            return response()->json([
                'message' => 'Logo subido exitosamente',
                'logo_url' => $logoUrl
            ]);
        }

        return response()->json(['message' => 'No file provided'], 400);
    }
}
