<?php

use App\Models\Contract;
use App\Models\Event;
use App\Models\EventType;
use App\Models\Organization;
use App\Models\User;
use Database\Seeders\ContractCategorySeeder;
use Database\Seeders\EventTypeSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use function Pest\Laravel\actingAs;
use function Pest\Laravel\deleteJson;
use function Pest\Laravel\getJson;
use function Pest\Laravel\postJson;
use function Pest\Laravel\putJson;

uses(RefreshDatabase::class, WithFaker::class);

beforeEach(function () {
    $this->seed(ContractCategorySeeder::class);
    $this->seed(EventTypeSeeder::class);

    $this->organization = Organization::factory()->create();
    $this->user = User::factory()->create(['organization_id' => $this->organization->id]);
    actingAs($this->user);

    $this->contract = Contract::factory()->create(['organization_id' => $this->organization->id]);
});

it('returns paginated events for the organization', function () {
    Event::factory()->count(5)->create(['contract_id' => $this->contract->id]);

    // Event from another organization
    $otherContract = Contract::factory()->create();
    Event::factory()->count(3)->create(['contract_id' => $otherContract->id]);

    $response = getJson('/api/event');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'message',
            'events',
            'meta' => ['total', 'current_page', 'last_page', 'per_page']
        ])
        ->assertJsonCount(5, 'events')
        ->assertJsonPath('meta.total', 5);
});

it('can search events', function () {
    $event = Event::factory()->create([
        'contract_id' => $this->contract->id,
        'title' => 'Specific Search Term'
    ]);
    Event::factory()->create([
        'contract_id' => $this->contract->id,
        'title' => 'Another item'
    ]);

    $response = getJson('/api/event?search=Specific');

    $response->assertOk()
        ->assertJsonCount(1, 'events')
        ->assertJsonPath('events.0.id', $event->id);
});

it('creates a new event', function () {
    $eventType = EventType::where('category_id', $this->contract->category_id)->first();
    $eventData = [
        'contract' => $this->contract->id,
        'event_type' => $eventType->id,
        'title' => 'Baile de Gala',
        'event_date' => '2026-12-25',
        'start_time' => '22:00',
    ];

    $response = postJson('/api/event', $eventData);

    $response
        ->assertOk()
        ->assertJson([
            'status' => 'success',
            'message' => 'Event created',
        ])
        ->assertJsonStructure(['event']);

    $this->assertDatabaseHas('events', [
        'contract_id' => $this->contract->id,
        'title' => 'Baile de Gala',
    ]);
});

it('fails to store with invalid data', function () {
    $response = postJson('/api/event', ['date' => 'invalid-date']);

    $response->assertStatus(422);
});

it('returns a specific event', function () {
    $event = Event::factory()->create(['contract_id' => $this->contract->id]);

    $response = getJson("/api/event/{$event->id}");

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'event' => [
                'id' => $event->id
            ]
        ]);
});

it('fails to show an event from another organization', function () {
    $otherContract = Contract::factory()->create();
    $event = Event::factory()->create(['contract_id' => $otherContract->id]);

    $response = getJson("/api/event/{$event->id}");

    $response->assertForbidden();
});

it('updates an existing event', function () {
    $event = Event::factory()->create(['contract_id' => $this->contract->id]);
    $eventType = EventType::where('category_id', $this->contract->category_id)->first();

    $updateData = [
        'contract' => $this->contract->id,
        'event_type' => $eventType->id,
        'title' => 'Colação de Grau Atualizada',
        'event_date' => '2027-01-15',
        'start_time' => '19:00',
    ];

    $response = putJson("/api/event/{$event->id}", $updateData);

    $response->assertOk()->assertJson(['status' => 'success', 'message' => 'Event updated']);

    $this->assertDatabaseHas('events', [
        'id' => $event->id,
        'title' => 'Colação de Grau Atualizada',
    ]);
});

it('fails to update an event from another organization', function () {
    $otherContract = Contract::factory()->create();
    $event = Event::factory()->create(['contract_id' => $otherContract->id]);
    $updateData = ['title' => 'new title'];

    $response = putJson("/api/event/{$event->id}", $updateData);

    $response->assertForbidden();
});

it('deletes an event', function () {
    $event = Event::factory()->create(['contract_id' => $this->contract->id]);

    $response = deleteJson("/api/event/{$event->id}");

    $response->assertOk()
        ->assertJson(['status' => 'success', 'message' => 'Event deleted']);

    $this->assertDatabaseMissing('events', ['id' => $event->id]);
});

it('fails to delete an event from another organization', function () {
    $otherContract = Contract::factory()->create();
    $event = Event::factory()->create(['contract_id' => $otherContract->id]);

    $response = deleteJson("/api/event/{$event->id}");

    $response->assertForbidden();
});

it('returns event types for a contract', function () {
    $count = EventType::where('category_id', $this->contract->category_id)->count();

    $response = getJson("/api/event/types/{$this->contract->id}");

    $response->assertOk()
        ->assertJsonStructure(['status', 'message', 'eventTypes'])
        ->assertJsonCount($count, 'eventTypes');
});

it('fails to get event types for a contract from another organization', function () {
    $otherContract = Contract::factory()->create();

    $response = getJson("/api/event/types/{$otherContract->id}");

    $response->assertForbidden();
});

it('returns images for an event', function () {
    $event = Event::factory()->create(['contract_id' => $this->contract->id]);

    $response = getJson("/api/event/{$event->id}/images");

    $response->assertOk()
        ->assertJsonStructure(['status', 'message', 'images']);
});

it('fails to get images for an event from another organization', function () {
    $otherContract = Contract::factory()->create();
    $event = Event::factory()->create(['contract_id' => $otherContract->id]);

    $response = getJson("/api/event/{$event->id}/images");

    $response->assertForbidden();
});