<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banca extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'address',
        'balance',
        'status',
    ];

    public function empleados()
    {
        return $this->hasMany(Empleado::class);
    }
}
