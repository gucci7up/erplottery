<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;

class BackupController extends Controller
{
    public function download(Request $request)
    {
        // As ERPLottery is running on SQLite, we can just download the database file directly.
        $dbPath = database_path('database.sqlite');

        if (!File::exists($dbPath)) {
            return response()->json(['message' => 'Base de datos no encontrada.'], 404);
        }

        $fileName = 'backup_erplottery_' . date('Y-m-d_H-i-s') . '.sqlite';

        return response()->download($dbPath, $fileName, [
            'Content-Type' => 'application/x-sqlite3',
        ]);
    }
}
