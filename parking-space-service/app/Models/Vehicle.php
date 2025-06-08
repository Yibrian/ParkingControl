<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    protected $fillable = [
        'user_id',
        'plate',
        'type',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
    ];
}