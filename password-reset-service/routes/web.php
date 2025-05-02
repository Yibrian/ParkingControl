<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json(['message' => 'Password Reset Service is running.'], 200);
})->name('send-link');