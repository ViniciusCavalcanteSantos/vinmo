<?php

use App\Mail\EmailConfirmation;
use App\Mail\EmailPasswordReset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;

uses(RefreshDatabase::class);

beforeEach(function () {
    Mail::fake();
});

it('sends a confirmation code', function () {
    $email = 'test@example.com';

    $response = $this->postJson('/api/send-code', ['email' => $email]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Code sent successfully',
        ]);

    Mail::assertSent(EmailConfirmation::class, function ($mail) use ($email) {
        return $mail->hasTo($email);
    });

    expect(session('confirmation_code'))->not->toBeNull()
        ->and(session('confirmation_email'))->toBe($email);
});

it('send code fails with invalid email', function () {
    $response = $this->postJson('/api/send-code', ['email' => 'not-an-email']);

    $response->assertStatus(422);
    Mail::assertNothingSent();
});

it('confirms a valid code', function () {
    $email = 'test@example.com';
    $code = '12345678';

    $this->withSession([
        'confirmation_email' => $email,
        'confirmation_code' => $code,
    ])->postJson('/api/confirm-code', [
        'email' => $email,
        'code' => $code,
    ])->assertOk()
        ->assertJson([
            'status' => 'success',
            'message' => 'Email verified successfully',
        ]);

    expect(session('email_verified_at'))->not->toBeNull();
});

it('fails to confirm an invalid code', function () {
    $email = 'test@example.com';
    $code = '12345678';

    $this->withSession([
        'confirmation_email' => $email,
        'confirmation_code' => $code,
    ])->postJson('/api/confirm-code', [
        'email' => $email,
        'code' => '87654321',
    ])->assertStatus(422)
        ->assertJson([
            'status' => 'error',
            'message' => 'The verification code entered is invalid',
        ]);

    expect(session('confirmation_attempts'))->toBe(1);
});

it('fails to confirm if session expired', function () {
    $this->postJson('/api/confirm-code', [
        'email' => 'test@example.com',
        'code' => '12345678',
    ])->assertStatus(422)
        ->assertJson([
            'status' => 'error',
            'message' => 'Verification code has expired',
        ]);
});

it('registers a new user successfully', function () {
    $email = 'test@example.com';
    $password = 'password';

    $this->withSession([
        'confirmation_email' => $email,
        'email_verified_at' => now()->toDateTimeString(),
    ]);

    $userData = [
        'name' => 'Test User',
        'password' => $password,
        'password_confirmation' => $password,
        'address' => [
            'postal_code' => '12345-678',
            'street' => 'Test Street',
            'number' => '123',
            'neighborhood' => 'Test Neighborhood',
            'city' => 'Test City',
            'state' => 'TS',
            'country' => 'BR',
        ],
    ];

    $response = $this->postJson('/api/register', $userData);

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Registration completed successfully',
        ])
        ->assertJsonStructure(['user'])
        ->assertCookie('logged_in');

    $this->assertDatabaseHas('users', [
        'email' => $email,
        'name' => 'Test User',
    ]);

    $this->assertDatabaseHas('addresses', [
        'street' => 'Test Street',
    ]);

    $this->assertAuthenticated();
});

it('register fails if email is not verified', function () {
    $response = $this->postJson('/api/register', [
        'name' => 'Test User',
        'password' => 'password',
        'password_confirmation' => 'password',
        'address' => [
            'postal_code' => '12345-678',
            'street' => 'Test Street',
            'number' => '123',
            'neighborhood' => 'Test Neighborhood',
            'city' => 'Test City',
            'state' => 'TS',
            'country' => 'BR',
        ],
    ]);

    $response->assertStatus(422);
    $this->assertGuest();
});

it('logs in a user successfully', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Login successfully',
        ])
        ->assertJsonStructure(['user'])
        ->assertCookie('logged_in');

    $this->assertAuthenticatedAs($user);
});

it('fails login with incorrect password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ]);

    $response->assertStatus(401)
        ->assertJson([
            'status' => 'error',
            'message' => 'Email or Password is incorrect',
        ]);

    $this->assertGuest();
});

it('returns the authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->getJson('/api/me');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
            ],
        ]);
});

it('logs out an authenticated user', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->postJson('/api/logout');

    $response->assertStatus(200)
        ->assertJson([
            'status' => 'success',
            'message' => 'Logout successfully',
        ])
        ->assertCookieExpired('logged_in');

    $this->assertGuest('web');
});

it('sends a password recovery link', function () {
    $user = User::factory()->create();

    Password::shouldReceive('createToken')
        ->once()
        ->with(\Mockery::on(fn($u) => $u->is($user)))
        ->andReturn('test-token');

    $response = $this->postJson('/api/send-recovery-link', ['email' => $user->email]);

    $response->assertOk()
        ->assertJson(['status' => 'success']);

    Mail::assertSent(EmailPasswordReset::class, function ($mail) use ($user) {
        return $mail->hasTo($user->email);
    });
});

it('send recovery link fails for non existent user', function () {
    $response = $this->postJson('/api/send-recovery-link', ['email' => 'no-user@example.com']);

    $response->assertOk()
        ->assertJson([
            'status' => 'error',
            'message' => "We can't find a user with that e-mail address",
        ]);

    Mail::assertNothingSent();
});

it('validates a recovery token', function () {
    $user = User::factory()->create();
    $token = 'a-valid-token-of-64-characters-long-for-testing-purposes-exactly';

    Password::shouldReceive('tokenExists')
        ->once()
        ->withArgs(fn($u, $t) => $u->is($user) && $t === $token)
        ->andReturn(true);

    $response = $this->postJson('/api/validate-recovery-token', [
        'email' => $user->email,
        'token' => $token,
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'message' => 'Token validated successfully',
        ]);
});

it('fails to validate an invalid recovery token', function () {
    $user = User::factory()->create();
    $token = 'an-invalid-token-of-64-characters-long-for-testing-purposes-now😜';

    Password::shouldReceive('tokenExists')
        ->once()
        ->withArgs(fn($u, $t) => $u->is($user) && $t === $token)
        ->andReturn(false);

    $response = $this->postJson('/api/validate-recovery-token', [
        'email' => $user->email,
        'token' => $token,
    ]);

    $response->assertOk()
        ->assertJson([
            'status' => 'error',
            'message' => 'Token not found or has expired',
        ]);
});

it('changes the password with a valid token', function () {
    $user = User::factory()->create();
    $token = 'a-valid-token-of-64-characters-long-for-testing-purposes-exactly';
    $newPassword = 'new-password';

    $payload = [
        'email' => $user->email,
        'password' => $newPassword,
        'password_confirmation' => $newPassword,
        'token' => $token,
    ];

    Password::shouldReceive('reset')
        ->once()
        ->with(
            \Mockery::on(fn($payloadPassed) => $payloadPassed === $payload),
            \Mockery::type(\Closure::class)
        )
        ->andReturn(Password::PASSWORD_RESET);

    $response = $this->postJson('/api/change-password', $payload);

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'message' => 'Your password was successfully changed',
        ]);
});

it('fails to change password with an invalid token', function () {
    $user = User::factory()->create();
    $token = 'an-invalid-token-of-64-characters-long-for-testing-purposes-now😜';
    $newPassword = 'new-password';

    $payload = [
        'email' => $user->email,
        'password' => $newPassword,
        'password_confirmation' => $newPassword,
        'token' => $token,
    ];

    Password::shouldReceive('reset')
        ->once()
        ->andReturn(Password::INVALID_TOKEN);

    $response = $this->postJson('/api/change-password', $payload);

    $response->assertOk()
        ->assertJson([
            'status' => 'error',
            'message' => 'Password reset link has expired. Please request a new one',
        ]);
});
