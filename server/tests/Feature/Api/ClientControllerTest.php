<?php

use App\Models\Client;
use App\Models\ClientRegisterLink;
use App\Models\Organization;
use App\Models\User;
use App\Services\ImageAnalysis\ImageAnalyzerFactory;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Tests\Fakes\FakeImageAnalyzerFactory;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class, WithFaker::class);

beforeEach(function () {
    $this->organization = Organization::factory()->create();
    $this->user = User::factory()->create(['organization_id' => $this->organization->id]);
    actingAs($this->user);
});

it('returns paginated clients for the organization', function () {
    Client::factory()->count(5)->create(['organization_id' => $this->organization->id]);

    // Client from another organization
    Client::factory()->count(3)->create();

    $response = getJson('/api/clients');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'message',
            'clients',
            'meta' => ['total', 'current_page', 'last_page', 'per_page']
        ])
        ->assertJsonCount(5, 'clients')
        ->assertJsonPath('meta.total', 5);
});

it('can search clients', function () {
    $client = Client::factory()->create([
        'organization_id' => $this->organization->id,
        'name' => 'Specific Search Term'
    ]);
    Client::factory()->create([
        'organization_id' => $this->organization->id,
        'name' => 'Another item'
    ]);

    $response = getJson('/api/clients?search=Specific');

    $response->assertOk()
        ->assertJsonCount(1, 'clients')
        ->assertJsonPath('clients.0.id', $client->id);
});

it('creates a new client', function () {
    Storage::fake('s3');
    Bus::fake();
    $this->app->bind(ImageAnalyzerFactory::class, FakeImageAnalyzerFactory::class);

    $file = UploadedFile::fake()->image('foto.jpg');
    $clientData = [
        'code' => '100',
        'name' => 'John Doe',
        'phone' => '1234567890',
        'profile' => $file
    ];

    $response = postJson('/api/clients', $clientData);

    $response
        ->assertOk()
        ->assertJson([
            'status' => 'success'
        ])
        ->assertJsonStructure(['client']);

    $this->assertDatabaseHas('clients', [
        'organization_id' => $this->organization->id,
        'name' => 'John Doe',
        'phone' => '1234567890',
    ]);
});

it('fails to store with invalid data', function () {
    $response = postJson('/api/clients', ['code' => 29]);

    $response->assertStatus(422);
});

it('returns a specific client', function () {
    $client = Client::factory()->create(['organization_id' => $this->organization->id]);

    $response = getJson("/api/clients/{$client->id}");

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'client' => [
                'id' => $client->id
            ]
        ]);
});

it('fails to show a client from another organization', function () {
    $client = Client::factory()->create();

    $response = getJson("/api/clients/{$client->id}");

    $response->assertForbidden();
});

it('updates an existing client', function () {
    $client = Client::factory()->create(['organization_id' => $this->organization->id]);

    $updateData = [
        'name' => 'Jane Doe Updated',
    ];

    $response = putJson("/api/clients/{$client->id}", $updateData);

    $response->assertOk()->assertJson(['status' => 'success', 'message' => 'Client updated']);

    $this->assertDatabaseHas('clients', [
        'id' => $client->id,
        'name' => 'Jane Doe Updated',
    ]);
});

it('fails to update a client from another organization', function () {
    $client = Client::factory()->create();
    $updateData = ['name' => 'new name'];

    $response = putJson("/api/clients/{$client->id}", $updateData);

    $response->assertForbidden();
});

it('deletes a client', function () {
    $client = Client::factory()->create(['organization_id' => $this->organization->id]);

    $response = deleteJson("/api/clients/{$client->id}");

    $response->assertOk()
        ->assertJson(['status' => 'success', 'message' => 'Client deleted']);

    $this->assertDatabaseMissing('clients', ['id' => $client->id]);
});

it('fails to delete a client from another organization', function () {
    $client = Client::factory()->create();

    $response = deleteJson("/api/clients/{$client->id}");

    $response->assertForbidden();
});

it('generates a client registration link', function () {
    $linkData = [
        'title' => 'Test Link',
        'require_address' => true,
        'require_guardian_if_minor' => true,
        'max_registers' => 10,
    ];

    $response = postJson('/api/clients/links', $linkData);

    $response->assertStatus(201)
        ->assertJsonStructure(['status', 'message', 'link_id']);

    $this->assertDatabaseHas('client_register_links', [
        'organization_id' => $this->organization->id,
        'title' => 'Test Link',
        'max_registers' => 10,
    ]);
});

it('gets client registration link info', function () {
    $link = ClientRegisterLink::query()->create([
        'organization_id' => $this->organization->id,
        'title' => 'My Link',
        'require_address' => true,
        'require_guardian_if_minor' => true,
        'max_registers' => 10,
        'used_registers' => 0
    ]);

    $linkIdEncoded = base64_encode($link->id);

    $response = getJson("/api/clients/links/{$linkIdEncoded}");

    $response->assertOk()
        ->assertJsonPath('linkInfo.title', $link->title);
});

it('creates a client from a public registration link', function () {
    Storage::fake('s3');
    Bus::fake();
    $this->app->bind(ImageAnalyzerFactory::class, FakeImageAnalyzerFactory::class);

    $otherOrg = Organization::factory()->create();
    $link = ClientRegisterLink::query()->create([
        'organization_id' => $otherOrg->id,
        'title' => 'Public link',
        'max_registers' => 5,
        'used_registers' => 0,
    ]);

    $linkIdEncoded = base64_encode($link->id);

    $file = UploadedFile::fake()->image('foto.jpg');
    $clientData = [
        'code' => '100',
        'name' => 'Public User',
        'birthdate' => '2000-05-10',
        'phone' => '1234567890',
        'profile' => $file
    ];

    $response = postJson("/api/public/clients/register/{$linkIdEncoded}", $clientData);

    $response->assertOk()
        ->assertJsonPath('client.name', 'Public User');

    $this->assertDatabaseHas('clients', [
        'organization_id' => $otherOrg->id,
        'name' => 'Public User',
        'phone' => '1234567890',
    ]);

    $this->assertDatabaseHas('client_register_links', [
        'id' => $link->id,
        'used_registers' => 1,
    ]);
});