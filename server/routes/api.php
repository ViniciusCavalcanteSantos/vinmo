<?php

use App\Http\Controllers\Api\ContractController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use \App\Http\Controllers\Api\AuthController;
use \App\Http\Controllers\Api\LocationController;

Route::post('/send_code', [AuthController::class, 'send_code']);
Route::post('/send_recovery_link', [AuthController::class, 'send_recovery_link']);
Route::post('/validate_recovery_token', [AuthController::class, 'validate_recovery_token']);
Route::post('/change_password', [AuthController::class, 'change_password']);
Route::post('/confirm_code', [AuthController::class, 'confirm_code']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/locations/countries', [LocationController::class, 'getCountries']);
    Route::get('/locations/countries/{country_cca2}/states', [LocationController::class, 'getStates']);
    Route::get('/locations/countries/{country_cca2}/states/{state_code}/cities', [LocationController::class, 'getCities']);

    Route::get('/contract/categories', [ContractController::class, 'getCategories']);
    Route::apiResource('/contract', ContractController::class);
});
