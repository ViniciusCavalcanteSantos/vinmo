<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Mail\EmailConfirmation;
use App\Mail\EmailPasswordReset;
use App\Models\User;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{

    public function send_code(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255|unique:users',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $code = str_pad(random_int(0, 99999999), 8, '0', STR_PAD_LEFT);

            Cache::clear();
            Cache::put('confirmation_code', $code);
            Cache::put('confirmation_email', $request->email);

            Mail::to($request->email)->send(new EmailConfirmation($code));

            return response()->json([
                'status' => 'success',
                'message' => __('Code sent successfully'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('We had a problem sending your email, please try again later'),
            ], 500);
        }
    }

    public function send_recovery_link(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => __("We can't find a user with that e-mail address"),
                ]);
            }

            $token = $user->currentAccessToken();
            if (!$token) {
                $token = Password::createToken($user);
            }

            Mail::to($request->email)->send(new EmailPasswordReset($user, $token));

            return response()->json([
                'status' => 'success',
                'message' => __('Code sent successfully'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('We had a problem sending your email, please try again later'),
            ], 500);
        }
    }

    public function validate_recovery_token(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|size:64',
            'email' => 'required|email|max:255',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $user = User::where('email', $request->email)->first();
            if (!$user) {
                return response()->json([
                    'status' => 'error',
                    'message' => __("We can't find a user with that e-mail address"),
                ]);
            }

            $status = Password::tokenExists($user, $request->token);
            if (!$status) {
                return response()->json([
                    'status' => 'error',
                    'message' => __('Token not found or has expired'),
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => __('Token validated successfully'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('We had a problem sending your email, please try again later'),
            ], 500);
        }
    }

    public function change_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|size:64',
            'email' => 'required|email|max:255',
            'password' => 'required|string|min:6|confirmed',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function ($user, $password) {
                    $user->forceFill([
                        'password' => bcrypt($password),
                    ])->save();

                    event(new PasswordReset($user));
                }
            );

            if ($status !== Password::PasswordReset) {
                return response()->json([
                    'status' => 'error',
                    'message' => __('Password reset link has expired. Please request a new one'),
                ]);
            }

            return response()->json([
                'status' => 'success',
                'message' => __('Your password was successfully changed'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('We had a problem sending your email, please try again later'),
            ], 500);
        }
    }

    public function confirm_code(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|max:255|unique:users',
            'code' => 'required|digits:8',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        try {
            $attempts = Cache::get('confirmation_attempts', 0);
            $attemptsMax = config('auth.max_email_confirmation_attempts');
            if ($attempts >= $attemptsMax) {
                return response()->json([
                    'status' => 'max_attempts',
                    'message' => __('Maximum number of attempts reached'),
                ], 422);
            }

            $code = $request->code;
            $email = $request->email;

            $codeSession = Cache::get('confirmation_code');
            $emailSession = Cache::get('confirmation_email');
            if (!$codeSession || !$emailSession) {
                return response()->json([
                    'status' => 'error',
                    'message' => __('Verification code has expired'),
                ], 422);
            }

            Cache::put('confirmation_attempts', $attempts + 1);
            if ($code !== $codeSession || $email !== $emailSession) {
                return response()->json([
                    'status' => 'error',
                    'message' => __('The verification code entered is invalid'),
                ], 422);
            }

            Cache::put('email_verified_at', now()->toDateTimeString());
            return response()->json([
                'status' => 'success',
                'message' => __('Email verified successfully'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('We were unable to confirm your code, please try again later'),
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
            'email_verified_at' => 'required|date_format:Y-m-d H:i:s',
            'address.postal_code' => 'required|string|max:12',
            'address.street' => 'required|string|max:120',
            'address.number' => 'required|string|max:10',
            'address.neighborhood' => 'required|string|max:40',
            'address.complement' => 'nullable|string|max:120',
            'address.city' => 'required|string|max:40',
            'address.state' => 'required|string|max:12',
            'address.country' => 'required|string|size:2',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        $validated = $validator->validated();

        try {
            $user = DB::transaction(function () use ($validated) {
                $user = User::create([
                    'name' => $validated['name'],
                    'email' => $validated['email'],
                    'email_verified_at' => $validated['email_verified_at'],
                    'password' => Hash::make($validated['password']),
                ]);

                $user->address()->create(array_merge($validated['address'], [
                    'label' => 'User Address',
                    'granularity' => 'full_address'
                ]));

                return $user;
            });
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'We had a problem creating your new account, please try again later',
            ], 422);
        }

        $token = $user->createToken('api_token')->plainTextToken;

        return response()->json([
            'status' => 'success',
            'message' => __('Registration completed successfully'),
            'token' => $token,
            'user' => new UserResource($user),
        ]);
    }

    public function login(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required|string',
            'remember_me' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'status' => 'error',
                'message' => __('Email or Password is incorrect'),
            ], 401);
        }

        $expiresAt = $request->remember_me
            ? now()->addWeek()
            : now()->addHours(2);

        $user = Auth::user();
        $user->load('address');
        $token = $user->createToken('api_token', ['*'], $expiresAt);

        return response()->json([
            'status' => 'success',
            'message' => __('Login successfully'),
            'token' => $token->plainTextToken,
            'user' => new UserResource($user),
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'message' => __('User successfully obtained'),
            'user' => new UserResource($request->user())
        ]);
    }
}
