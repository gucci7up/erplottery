<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PagoNomina extends Model
{
    use HasFactory;

    protected $table = 'pagos_nomina';

    protected $fillable = [
        'empleado_id',
        'banca_id',
        'month_year',
        'payment_date',
        'base_salary',
        'deductions',
        'bonuses',
        'net_pay',
        'status',
    ];

    public function empleado()
    {
        return $this->belongsTo(Empleado::class);
    }

    public function banca()
    {
        return $this->belongsTo(Banca::class);
    }
}
