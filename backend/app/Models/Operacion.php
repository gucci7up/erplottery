<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Operacion extends Model
{
    use HasFactory;

    protected $table = 'operaciones';

    protected $fillable = [
        'banca_id',
        'operation_date',
        'ventas_brutas',
        'premios_pagados',
        'gastos_banca',
        'balance_neto',
    ];

    public function banca()
    {
        return $this->belongsTo(Banca::class);
    }
}
