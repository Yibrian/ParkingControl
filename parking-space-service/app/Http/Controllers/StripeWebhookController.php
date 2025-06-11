<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Notification;
use App\Models\Space;
use Illuminate\Support\Facades\Log;
use Stripe\Webhook;

class StripeWebhookController extends Controller
{
    public function handle(Request $request)
    {
        $payload = $request->getContent();
        $sig_header = $request->header('Stripe-Signature');
        $endpoint_secret = env('STRIPE_WEBHOOK_SECRET');

        try {
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        } catch (\Exception $e) {
            Log::error('Stripe webhook signature error', ['error' => $e->getMessage()]);
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session = $event->data->object;
            $metadata = $session->metadata ?? null;
            \Log::info('Webhook recibido', (array)$metadata);

            if ($metadata && isset($metadata->reservation_id) && isset($metadata->extra_hours)) {
                \Log::info('Intentando extender reserva', [
                    'reservation_id' => $metadata->reservation_id,
                    'extra_hours' => $metadata->extra_hours
                ]);
                $controller = new \App\Http\Controllers\ReservationController();
                $request = new \Illuminate\Http\Request([
                    'extra_hours' => $metadata->extra_hours
                ]);
                $response = $controller->extend($request, $metadata->reservation_id);
                \Log::info('Respuesta de extend', ['response' => $response]);
            } else {
                if ($metadata) {
                    $reservation = Reservation::create([
                        'user_id' => $metadata->user_id,
                        'space_id' => $metadata->space_id,
                        'vehicle_id' => $metadata->vehicle_id,
                        'start_date' => $metadata->start_date,
                        'start_time' => $metadata->start_time,
                        'end_date' => $metadata->end_date,
                        'end_time' => $metadata->end_time,
                        'description' => $metadata->description,
                        'status' => 'confirmada',
                    ]);
                    Log::info('Reserva creada desde Stripe webhook', ['reservation_id' => $reservation->id]);

                    // Crear notificación para el usuario
                    $space = Space::find($metadata->space_id);
                    Notification::create([
                        'user_id' => $reservation->user_id,
                        'title' => 'Reserva confirmada',
                        'message' => 'Tu reserva ha sido confirmada para el espacio ' . ($space ? $space->name : '') .
                            ' desde el ' . date('d/m/Y', strtotime($reservation->start_date)) . ' a las ' . date('h:i A', strtotime($reservation->start_time)) .
                            ' hasta el ' . date('d/m/Y', strtotime($reservation->end_date)) . ' a las ' . date('h:i A', strtotime($reservation->end_time)) . '.',
                    ]);

                    if ($space && $space->available_spaces > 0) {
                        $space->available_spaces -= 1;
                        $space->save();
                        Log::info('Espacio actualizado desde webhook', ['space_id' => $space->id, 'available_spaces' => $space->available_spaces]);
                    }
                }
            }
        }

        return response()->json(['status' => 'success']);
    }
}