<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

Route::get('/{any}', function () {
    $path = public_path('index.html');
    if (!File::exists($path)) {
        return "El frontend de React no ha sido compilado en la carpeta public de Laravel. (Missing index.html)";
    }
    return file_get_contents($path);
})->where('any', '^(?!api).*$');
