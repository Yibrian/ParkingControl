<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmployeeReservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'employee_id',
        'space_id',
        'start_date',
        'start_time',
        'end_date',
        'end_time',
        'description',
        'vehicle_plate', 
        'vehicle_type',  
    ];

    public function space()
    {
        return $this->belongsTo(Space::class);
    }
}