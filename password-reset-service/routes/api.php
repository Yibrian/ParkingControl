<?php

use App\Http\Controllers\PasswordResetController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('password-reset')->group(function () {
        Route::post('send-link', [PasswordResetController::class, 'sendResetLink']);
        Route::post('reset', [PasswordResetController::class, 'resetPassword']); // Token validado en el controlador
    });
});