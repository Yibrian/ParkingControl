<?php
use App\Http\Controllers\SpaceController;

Route::apiResource('spaces', SpaceController::class);
Route::patch('spaces/{id}/toggle-active', [SpaceController::class, 'toggleActive']);