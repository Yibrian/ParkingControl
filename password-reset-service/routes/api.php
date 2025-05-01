<?php
use App\Http\Controllers\PasswordResetController;

Route::post('/password-reset/send-link', [PasswordResetController::class, 'sendResetLink']);
Route::post('/password-reset/reset', [PasswordResetController::class, 'resetPassword']);