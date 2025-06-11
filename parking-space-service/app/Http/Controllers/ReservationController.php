<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\Reservation;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|integer',
            'space_id' => 'required|integer|exists:spaces,id',
            'vehicle_id' => 'required|integer',
            'start_date' => 'required|date',
            'start_time' => 'required',
            'end_date' => 'required|date|after_or_equal:start_date',
            'end_time' => 'required',
            'description' => 'nullable|string',
        ]);

        // Crea la reserva con estado pendiente
        $reservation = Reservation::create([
            ...$validated,
            'status' => 'pendiente',
        ]);

        // Notificación de reserva confirmada
        Notification::create([
            'user_id' => $reservation->user_id,
            'title' => 'Reserva confirmada',
            'message' => 'Tu reserva ha sido confirmada para el espacio ' . $reservation->space->name .
                ' desde el ' . date('d/m/Y', strtotime($reservation->start_date)) . ' a las ' . date('h:i A', strtotime($reservation->start_time)) .
                ' hasta el ' . date('d/m/Y', strtotime($reservation->end_date)) . ' a las ' . date('h:i A', strtotime($reservation->end_time)) . '.',
        ]);

        // Actualiza available_spaces
        $space->available_spaces = $space->total_spaces - ($activeReservations + 1);
        $space->save();

        return response()->json($reservation->load('space'), 201);
    }

    public function extend(Request $request, $id)
    {
        \Log::info('Extend llamado', ['reservation_id' => $id, 'request' => $request->all()]);

        $validated = $request->validate([
            'extra_hours' => 'required|integer|min:1',
        ]);

        $reservation = Reservation::findOrFail($id);

        $currentEndDateTime = new \DateTime("{$reservation->end_date} {$reservation->end_time}");
        $currentEndDateTime->modify("+{$validated['extra_hours']} hour");

        $reservation->end_date = $currentEndDateTime->format('Y-m-d');
        $reservation->end_time = $currentEndDateTime->format('H:i:s');
        $reservation->save();

        
        Notification::create([
            'user_id' => $reservation->user_id,
            'title' => 'Reserva extendida',
            'message' => 'Tu reserva ha sido extendida hasta el ' .
                date('d/m/Y', strtotime($reservation->end_date)) . ' a las ' .
                date('h:i A', strtotime($reservation->end_time)) . '.',
        ]);

        \Log::info('Reserva extendida', [
            'reservation_id' => $reservation->id,
            'nueva_fecha_fin' => $reservation->end_date,
            'nueva_hora_fin' => $reservation->end_time
        ]);

        return response()->json($reservation, 200);
    }

    public function index(Request $request)
    {
        $query = Reservation::query();

        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }

        $reservations = $query->with('space')->orderBy('start_date', 'desc')->get();

        return response()->json($reservations);
    }

    public function finish($id)
    {
        $reservation = Reservation::findOrFail($id);

        if (!in_array($reservation->status, ['confirmada', 'pendiente'])) {
            return response()->json(['error' => 'Solo puedes finalizar reservas activas.'], 400);
        }

        $reservation->status = 'finalizada';
        $reservation->save();

        $space = Space::findOrFail($reservation->space_id);
        $space->available_spaces = min($space->available_spaces + 1, $space->total_spaces);
        $space->save();

        return response()->json(['success' => true, 'reservation' => $reservation]);
    }

    public function cancel($id)
    {
        $reservation = Reservation::findOrFail($id);

        if ($reservation->status === 'cancelada') {
            return response()->json(['error' => 'La reserva ya está cancelada.'], 400);
        }

        $reservation->status = 'cancelada';
        $reservation->save();

        $space = Space::findOrFail($reservation->space_id);
        $space->available_spaces = min($space->available_spaces + 1, $space->total_spaces);
        $space->save();

        Notification::create([
            'user_id' => $reservation->user_id,
            'title' => 'Reserva cancelada',
            'message' => 'Tu reserva para el espacio ' . $space->name .
                ' del ' . date('d/m/Y', strtotime($reservation->start_date)) . ' a las ' . date('h:i A', strtotime($reservation->start_time)) .
                ' ha sido cancelada.',
        ]);

        return response()->json(['success' => true, 'reservation' => $reservation]);
    }
}