<?php

use App\Http\Controllers\Api\AssignmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\ContractController;
use App\Http\Controllers\Api\EventController;
use App\Http\Controllers\Api\EventPhotoController;
use App\Http\Controllers\Api\LocationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Symfony\Component\Process\Process;

Route::post('/send_code', [AuthController::class, 'send_code']);
Route::post('/send_recovery_link', [AuthController::class, 'send_recovery_link']);
Route::post('/validate_recovery_token', [AuthController::class, 'validate_recovery_token']);
Route::post('/change_password', [AuthController::class, 'change_password']);
Route::post('/confirm_code', [AuthController::class, 'confirm_code']);
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::get('/locations/countries', [LocationController::class, 'getCountries']);
Route::get('/locations/countries/{country_cca2}/states', [LocationController::class, 'getStates']);
Route::get('/locations/countries/{country_cca2}/states/{state_code}/cities',
    [LocationController::class, 'getCities']);

Route::post('/public/client/register/{linkId}', [ClientController::class, 'storePublic']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);

    Route::get('/contract/categories', [ContractController::class, 'getCategories']);
    Route::apiResource('/contract', ContractController::class);

    Route::get('event/types/{contract}', [EventController::class, 'getEventTypes']);
    Route::apiResource('/event', EventController::class);


    Route::apiResource('/event/photo', EventPhotoController::class);

    Route::apiResource('/client', ClientController::class);
    Route::get('/client/get-link-info/{linkId}', [ClientController::class, 'getLinkInfo']);
    Route::post('/client/generate-register-link', [ClientController::class, 'generateLink']);


    Route::apiResource('/assignment/client', AssignmentController::class);
    Route::post('/assignment/client/{client}', [AssignmentController::class, 'store']);
    Route::post('/assignment/bulk', [AssignmentController::class, 'storeBulk']);
    Route::delete('/assignment/bulk', [AssignmentController::class, 'destroyBulk']);
});

Route::post('/deploy/webhook', function (Request $request) {
    $githubSecret = config('app.github_webhook_secret');

    if (!$githubSecret) {
        Log::error('DEPLOY ABORTADO: GITHUB_WEBHOOK_SECRET não está configurado.');
        abort(500, 'Webhook secret não configurado no servidor.');
    }

    $signature = $request->header('X-Hub-Signature-256');

    $hash = 'sha256='.hash_hmac('sha256', $request->getContent(), $githubSecret);
    if (!hash_equals($signature, $hash)) {
        Log::warning('DEPLOY RECUSADO: Assinatura do webhook inválida.');
        abort(403, 'Assinatura inválida.');
    }

    $scriptPath = '/usr/pr/deploy.sh';

    Log::info('>>> INICIANDO DEPLOY AUTOMÁTICO VIA WEBHOOK <<<');
    $process = new Process(['sudo', '-u', 'pruser', '/bin/bash', $scriptPath]);
    $process->run();

    if (!$process->isSuccessful()) {
        Log::error('Falha no deploy automático.', [
            'exit_code' => $process->getExitCode(),
            'output' => $process->getOutput(),
            'error_output' => $process->getErrorOutput(),
        ]);
        return response()->json(['status' => 'falha', 'output' => $process->getErrorOutput()], 500);
    }

    Log::info('Deploy executado com sucesso.', ['output' => $process->getOutput()]);

    return response()->json(['status' => 'sucesso', 'output' => $process->getOutput()]);
});

