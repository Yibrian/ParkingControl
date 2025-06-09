<?php
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\VehicleController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\StripeController;
use App\Http\Controllers\StripeWebhookController;
use App\Http\Controllers\NotificationController;

Route::apiResource('spaces', SpaceController::class);
Route::patch('spaces/{id}/toggle-active', [SpaceController::class, 'toggleActive']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::post('/vehicles', [VehicleController::class, 'store']);
Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);
Route::patch('/vehicles/{id}/default', [VehicleController::class, 'setDefault']);

Route::post('/reservations', [ReservationController::class, 'store']);
Route::put('/reservations/{id}/extend', [ReservationController::class, 'extend']);
Route::put('/reservations/{id}/finish', [ReservationController::class, 'finish']);
Route::put('/reservations/{id}/cancel', [ReservationController::class, 'cancel']);
Route::get('/reservations', [ReservationController::class, 'index']);
Route::post('/stripe/checkout', [StripeController::class, 'createCheckoutSession']);
Route::post('/stripe/webhook', [StripeWebhookController::class, 'handle']);
Route::get('/notifications', [NotificationController::class, 'index']);
Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
Route::post('/notifications/mark-all-read', [NotificationController::class, 'markAllRead']);
Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);