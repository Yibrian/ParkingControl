<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Stripe\Stripe;
use Stripe\Checkout\Session as StripeSession;

class StripeController extends Controller
{
    public function createCheckoutSession(Request $request)
    {
        $validated = $request->validate([
            'reservation_id' => 'required|integer|exists:reservations,id',
            'amount' => 'required|numeric|min:1',
        ]);

        \Log::info('Stripe checkout', $validated);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'cop',
                    'product_data' => [
                        'name' => 'Reserva de parqueadero',
                    ],
                    'unit_amount' => intval($validated['amount'] * 100), // Stripe usa centavos
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => env('FRONTEND_URL') . '/client?success=1&reservation_id=' . $validated['reservation_id'],
            'cancel_url' => env('FRONTEND_URL') . '/client?canceled=1',
            'metadata' => [
                'reservation_id' => $validated['reservation_id'],
            ],
        ]);

        return response()->json(['url' => $session->url]);
    }
}