<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Space;
use App\Models\Vehicle;
use App\Models\Notification;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Models\EmployeeReservation;

class EmployeeReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'employee_id' => 'required|integer',
            'space_id' => 'required|integer',
            'start_date' => 'required|date',
            'start_time' => 'required',
            'vehicle_plate' => 'required|string',
            'vehicle_type' => 'required|string',
            'description' => 'nullable|string',
        ]);

        $reservation = EmployeeReservation::create($validated);

        $space = Space::find($request->space_id);
        if ($space) {
            $space->available_spaces = max(0, $space->available_spaces - 1);
            $space->save();
        }

        return response()->json($reservation, 201);
    }

    public function finish($id)
    {
        $reservation = EmployeeReservation::findOrFail($id);

        if ($reservation->end_date || $reservation->end_time) {
            return response()->json(['error' => 'La reserva ya fue finalizada.'], 400);
        }

        $now = now();
        $reservation->end_date = $now->toDateString();
        $reservation->end_time = $now->format('H:i:s');
        $reservation->status = 'finalizada';
        $reservation->save();

        // Liberar espacio
        $space = $reservation->space;
        if ($space) {
            $space->available_spaces = min($space->available_spaces + 1, $space->total_spaces);
            $space->save();
        }

        return response()->json($reservation);
    }

    public function index(Request $request)
    {
        $query = EmployeeReservation::query();

        
        if ($request->has('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        
        $reservations = $query->with('space')->orderBy('start_date', 'desc')->get();

        return response()->json($reservations);
    }
}