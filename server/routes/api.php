<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\AuthController;

Route::post('/send_code', [AuthController::class, 'send_code']);
Route::post('/send_recovery_link', [AuthController::class, 'send_recovery_link']);
Route::post('/validate_recovery_token', [AuthController::class, 'validate_recovery_token']);
Route::post('/change_password', [AuthController::class, 'change_password']);
Route::post('/confirm_code', [AuthController::class, 'confirm_code']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});
