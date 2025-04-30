<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('register', [AuthController::class, 'register']);
        Route::post('login', [AuthController::class, 'login']);

        Route::middleware('auth:api')->group(function () {
            Route::get('me', [AuthController::class, 'me']);
            Route::post('refresh', [AuthController::class, 'refresh']);
            Route::get('logout', [AuthController::class, 'logout'])->name('logout');
        });
    });

    Route::middleware('auth:api')->group(function () {
        Route::get('profile', [UserController::class, 'getProfile']);
        Route::put('profile', [UserController::class, 'updateProfile']);
        Route::get('users', [UserController::class, 'getUsers']);
        Route::post('users', [UserController::class, 'createUser']);
        Route::post('/profile/picture', [UserController::class, 'updateProfilePicture']);
        Route::patch('users/{id}/toggle-active', [UserController::class, 'toggleActive']);
    });
});