<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    protected $fillable = [
        'user_id', 'space_id', 'vehicle_id', 'start_date', 'start_time', 'end_date', 'end_time', 'description', 'status'
    ];

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}