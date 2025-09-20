<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\EmailConfirmation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function send_code(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255|unique:users',
        ]);
        if ($validator->fails()) return response()->json(['error' => $validator->errors()->first()], 422);

        try {
            $code = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);

            Cache::clear();
            Cache::put('confirmation_code', $code);
            Cache::put('confirmation_email', $request->email);

            Mail::to($request->email)->send(new EmailConfirmation($code));

            return response()->json([
                'message' => "Código enviado com sucesso!",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Tivemos um problema ao enviar seu email, tente  novamente mais tarde.',
            ], 500);
        }
    }

    public function confirm_code(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255|unique:users',
            'code' => 'required|digits:8',
        ]);
        if ($validator->fails()) return response()->json(['error' => $validator->errors()->first()], 422);

        try {
            $attempts = Cache::get('confirmation_attempts', 0);
            $attemptsMax = config('auth.max_email_confirmation_attempts');
            if ($attempts >= $attemptsMax) {
                return response()->json([
                    'error' => 'Número máximo de tentativas atingido.',
                ], 422);
            }

            $code = $request->code;
            $email = $request->email;

            $codeSession = Cache::get('confirmation_code');
            $emailSession = Cache::get('confirmation_email');
            if (!$codeSession || !$emailSession) {
                return response()->json([
                    'error' => 'O código de verificação expirou',
                ], 422);
            }

            Cache::put('confirmation_attempts', $attempts + 1);
            if ($code !== $codeSession || $email !== $emailSession) {
                return response()->json([
                    'error' => 'O código de verificação inserido é inválido',
                ], 422);
            }

            Cache::put('email_verified_at', Carbon::now()->toDateTimeString());
            return response()->json([
                'message' => 'Email verificado com sucesso!',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Não foi possível confirmar o seu código, tente novamente mais tarde' . $e->getMessage(),
            ], 500);
        }
    }

    public function register(Request $request): JsonResponse
    {
        $request->merge([
            'email' => Cache::get('confirmation_email'),
            'email_verified_at' => Cache::get('email_verified_at'),
        ]);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'email_verified_at' => 'required|date_format:Y-m-d H:i:s'
        ]);
        if ($validator->fails()) return response()->json(['error' => $validator->errors()->first()], 422);


        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'email_verified_at' => $request->email_verified_at,
            'password' => Hash::make($request->password),
        ]);

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['error' => 'Credenciais inválidas'], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json($request->user());
    }
}
