<?php

namespace Tests\Feature\Api;

use App\Mail\EmailConfirmation;
use App\Mail\EmailPasswordReset;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    #[Test]
    public function it_sends_a_confirmation_code()
    {
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

        $this->assertNotNull(session('confirmation_code'));
        $this->assertEquals($email, session('confirmation_email'));
    }

    #[Test]
    public function send_code_fails_with_invalid_email()
    {
        $response = $this->postJson('/api/send-code', ['email' => 'not-an-email']);

        $response->assertStatus(422);
        Mail::assertNothingSent();
    }

    #[Test]
    public function it_confirms_a_valid_code()
    {
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

        $this->assertNotNull(session('email_verified_at'));
    }

    #[Test]
    public function it_fails_to_confirm_an_invalid_code()
    {
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

        $this->assertEquals(1, session('confirmation_attempts'));
    }

    #[Test]
    public function it_fails_to_confirm_if_session_expired()
    {
        $this->postJson('/api/confirm-code', [
            'email' => 'test@example.com',
            'code' => '12345678',
        ])->assertStatus(422)
            ->assertJson([
                'status' => 'error',
                'message' => 'Verification code has expired',
            ]);
    }

    #[Test]
    public function it_registers_a_new_user_successfully()
    {
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
    }

    #[Test]
    public function register_fails_if_email_is_not_verified()
    {
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
    }

    #[Test]
    public function it_logs_in_a_user_successfully()
    {
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
    }

    #[Test]
    public function it_fails_login_with_incorrect_password()
    {
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
    }

    #[Test]
    public function it_returns_the_authenticated_user()
    {
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
    }

    #[Test]
    public function it_logs_out_an_authenticated_user()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->postJson('/api/logout');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Logout successfully',
            ])
            ->assertCookieExpired('logged_in');

        $this->assertGuest('web');
    }

    #[Test]
    public function it_sends_a_password_recovery_link()
    {
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
    }

    #[Test]
    public function send_recovery_link_fails_for_non_existent_user()
    {
        $response = $this->postJson('/api/send-recovery-link', ['email' => 'no-user@example.com']);

        $response->assertOk()
            ->assertJson([
                'status' => 'error',
                'message' => "We can't find a user with that e-mail address",
            ]);

        Mail::assertNothingSent();
    }

    #[Test]
    public function it_validates_a_recovery_token()
    {
        $user = User::factory()->create();
        $token = 'a-valid-token-of-64-characters-long-for-testing-purposes-exactly';

        Password::shouldReceive('tokenExists')
            ->once()
            ->withArgs(fn($u, $t) => $u->is($user) && $t == $token)
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
    }

    #[Test]
    public function it_fails_to_validate_an_invalid_recovery_token()
    {
        $user = User::factory()->create();
        $token = 'an-invalid-token-of-64-characters-long-for-testing-purposes-now😜';

        Password::shouldReceive('tokenExists')
            ->once()
            ->with(
                \Mockery::on(fn($u) => $u->is($user)),
                $token
            )
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
    }

    #[Test]
    public function it_changes_the_password_with_a_valid_token()
    {
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
                $this->equalTo($payload),
                $this->isInstanceOf(\Closure::class)
            )
            ->andReturn(Password::PASSWORD_RESET);

        $response = $this->postJson('/api/change-password', $payload);

        $response->assertOk()
            ->assertJson([
                'status' => 'success',
                'message' => 'Your password was successfully changed',
            ]);
    }

    #[Test]
    public function it_fails_to_change_password_with_an_invalid_token()
    {
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
    }
}