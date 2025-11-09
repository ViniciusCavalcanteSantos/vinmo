<?php

use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventPhotoController;
use App\Http\Controllers\Api\ImageController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('/api')->group(function () {
    Route::post('/send_code', [AuthController::class, 'send_code']);
    Route::post('/send_recovery_link', [AuthController::class, 'send_recovery_link']);
    Route::post('/validate_recovery_token', [AuthController::class, 'validate_recovery_token']);
    Route::post('/change_password', [AuthController::class, 'change_password']);
    Route::post('/confirm_code', [AuthController::class, 'confirm_code']);
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/images/{image}', [ImageController::class, 'show'])->name('images.show');
    Route::get('/images/{image}/download', [ImageController::class, 'download'])->name('images.show');
    Route::get('/images/{image}/metadata', [ImageController::class, 'metadata'])->name('images.show');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/logout', [AuthController::class, 'logout']); // 👈 aqui

        Route::get('/contract/categories', [ContractController::class, 'getCategories']);
        Route::apiResource('/contract', ContractController::class);

        Route::get('event/types/{contract}', [EventController::class, 'getEventTypes']);
        Route::apiResource('/event', EventController::class);
        Route::get('event/{event}/images', [EventController::class, 'getImages']);

        Route::apiResource('/event/photo', EventPhotoController::class);

        Route::apiResource('/client', ClientController::class);
        Route::get('/client/get-link-info/{linkId}', [ClientController::class, 'getLinkInfo']);
        Route::post('/client/generate-register-link', [ClientController::class, 'generateLink']);


        Route::apiResource('/assignment/client', AssignmentController::class);
        Route::post('/assignment/client/{client}', [AssignmentController::class, 'store']);
        Route::post('/assignment/bulk', [AssignmentController::class, 'storeBulk']);
        Route::delete('/assignment/bulk', [AssignmentController::class, 'destroyBulk']);
    });
});
