<?php

namespace App\Http\Controllers;

use App\Models\Space;
use App\Models\Notification;
use Illuminate\Http\Request;

class SpaceController extends Controller
{
    public function index()
    {
        return response()->json(Space::all(), 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'vehicle_type' => 'required|string|max:255',
            'price_per_hour' => 'required|numeric|min:0',
            'total_spaces' => 'required|integer|min:1',
            'start_time' => 'required|date_format:H:i', // Validar formato de hora
            'end_time' => 'required|date_format:H:i|after:start_time', // Validar que sea después de start_time
        ]);

        // Asignar available_spaces igual a total_spaces al crear
        $validated['available_spaces'] = $validated['total_spaces'];

        $space = Space::create($validated);

        return response()->json($space, 201);
    }

    public function show(Space $space)
    {
        return response()->json($space, 200);
    }

    public function update(Request $request, Space $space)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'vehicle_type' => 'sometimes|string|max:255',
            'price_per_hour' => 'sometimes|numeric|min:0',
            'total_spaces' => 'sometimes|integer|min:1',
            'start_time' => 'sometimes|date_format:H:i',
            'end_time' => 'sometimes|date_format:H:i|after:start_time',
            'active' => 'sometimes|boolean',
        ]);

        $space->update($validated);

        return response()->json($space, 200);
    }

    public function destroy(Space $space)
    {
        $space->delete();

        return response()->json(null, 204);
    }

    public function toggleActive($id)
    {
        $space = Space::find($id);

        if (!$space) {
            return response()->json(['error' => 'Espacio no encontrado.'], 404);
        }

        // Cambiar el estado de active
        $space->active = !$space->active;
        $space->save();

        return response()->json(['active' => $space->active], 200);
    }

    public function handle(Request $request)
    {
        // ... lógica para procesar el evento de Stripe ...
        if ($event->type === 'checkout.session.completed') {
            $reservation = Reservation::find($reservationId);
            Notification::create([
                'user_id' => $reservation->user_id,
                'title' => 'Pago exitoso',
                'message' => 'Tu pago ha sido procesado exitosamente para la reserva en ' . $reservation->space->name . '.',
            ]);
        } elseif ($event->type === 'checkout.session.failed') {
            $reservation = Reservation::find($reservationId);
            Notification::create([
                'user_id' => $reservation->user_id,
                'title' => 'Pago fallido',
                'message' => 'Hubo un problema con tu pago para la reserva en ' . $reservation->space->name . '. Intenta nuevamente.',
            ]);
        }
        // ...
    }
}
