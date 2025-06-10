<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Reservation;
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
            Log::info('Stripe webhook checkout.session.completed', (array)$metadata);

            if ($metadata) {
                // Crea la reserva solo si no existe una igual (puedes mejorar la lógica según tus reglas)
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
            }
        }

        return response()->json(['status' => 'success']);
    }
}