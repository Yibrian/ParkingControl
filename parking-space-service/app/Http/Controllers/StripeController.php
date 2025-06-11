<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        // Si es extensión de horas
        if ($request->has('reservation_id') && $request->has('extra_hours')) {
            $validated = $request->validate([
                'reservation_id' => 'required|integer|exists:reservations,id',
                'extra_hours' => 'required|integer|min:1',
                'amount' => 'required|numeric|min:1',
            ]);
            // Busca la reserva para obtener user_id, etc. si lo necesitas
            $reservation = \App\Models\Reservation::findOrFail($validated['reservation_id']);
            $user_id = $reservation->user_id;
            $space_id = $reservation->space_id;
            $vehicle_id = $reservation->vehicle_id;
            // ...otros datos si los necesitas...
        } else {
            // Reserva nueva
            $validated = $request->validate([
                'user_id' => 'required|integer',
                'space_id' => 'required|integer',
                'vehicle_id' => 'required|integer',
                'start_date' => 'required|date',
                'start_time' => 'required',
                'end_date' => 'required|date',
                'end_time' => 'required',
                'amount' => 'required|numeric|min:1',
                'description' => 'nullable|string',
            ]);
            $user_id = $validated['user_id'];
            $space_id = $validated['space_id'];
            $vehicle_id = $validated['vehicle_id'];
        }

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'cop',
                    'product_data' => [
                        'name' => 'Reserva de parqueadero',
                    ],
                    'unit_amount' => intval($request->amount * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => env('FRONTEND_URL') . '/client?success=1',
            'cancel_url' => env('FRONTEND_URL') . '/client?canceled=1',
            'metadata' => [
                'reservation_id' => $request->reservation_id ?? null,
                'extra_hours' => $request->extra_hours ?? null,
                'user_id' => $user_id ?? null,
                'space_id' => $space_id ?? null,
                'vehicle_id' => $vehicle_id ?? null,
                'start_date' => $request->start_date ?? null,
                'start_time' => $request->start_time ?? null,
                'end_date' => $request->end_date ?? null,
                'end_time' => $request->end_time ?? null,
                'description' => $request->input('description', ''),
            ],
        ]);

        Log::info('Stripe checkout SESSION', ['id' => $session->id, 'url' => $session->url]);

        return response()->json(['url' => $session->url]);
    }
}