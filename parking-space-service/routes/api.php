<?php
use App\Http\Controllers\SpaceController;
use App\Http\Controllers\VehicleController;

Route::apiResource('spaces', SpaceController::class);
Route::patch('spaces/{id}/toggle-active', [SpaceController::class, 'toggleActive']);

Route::get('/vehicles', [VehicleController::class, 'index']);
Route::post('/vehicles', [VehicleController::class, 'store']);
Route::put('/vehicles/{id}', [VehicleController::class, 'update']);
Route::delete('/vehicles/{id}', [VehicleController::class, 'destroy']);
Route::patch('/vehicles/{id}/default', [VehicleController::class, 'setDefault']);