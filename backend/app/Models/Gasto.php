<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Gasto extends Model
{
    use HasFactory;

    protected $fillable = [
        'description',
        'category',
        'amount',
        'expense_date',
        'banca_id',
    ];

    public function banca()
    {
        return $this->belongsTo(Banca::class);
    }
}
