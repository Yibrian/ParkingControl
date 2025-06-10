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

        Log::info('Stripe checkout INIT', $validated);

        Stripe::setApiKey(env('STRIPE_SECRET'));

        $session = StripeSession::create([
            'payment_method_types' => ['card'],
            'line_items' => [[
                'price_data' => [
                    'currency' => 'cop',
                    'product_data' => [
                        'name' => 'Reserva de parqueadero',
                    ],
                    'unit_amount' => intval($validated['amount'] * 100),
                ],
                'quantity' => 1,
            ]],
            'mode' => 'payment',
            'success_url' => env('FRONTEND_URL') . '/client?success=1',
            'cancel_url' => env('FRONTEND_URL') . '/client?canceled=1',
            'metadata' => [
                'user_id' => $validated['user_id'],
                'space_id' => $validated['space_id'],
                'vehicle_id' => $validated['vehicle_id'],
                'start_date' => $validated['start_date'],
                'start_time' => $validated['start_time'],
                'end_date' => $validated['end_date'],
                'end_time' => $validated['end_time'],
                'description' => $validated['description'] ?? '',
            ],
        ]);

        Log::info('Stripe checkout SESSION', ['id' => $session->id, 'url' => $session->url]);

        return response()->json(['url' => $session->url]);
    }
}