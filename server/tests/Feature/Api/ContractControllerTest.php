<?php

use App\Models\Contract;
use App\Models\ContractCategory;
use App\Models\Organization;
use App\Models\User;
use Database\Seeders\ContractCategorySeeder;
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
    $this->organization = Organization::factory()->create();
    $this->user = User::factory()->create(['organization_id' => $this->organization->id]);
    actingAs($this->user);
});

it('returns paginated contracts for the organization', function () {
    Contract::factory()->count(5)->create(['organization_id' => $this->organization->id]);
    Contract::factory()->count(3)->create(); // Other organization

    $response = getJson('/api/contract');

    $response->assertOk()
        ->assertJsonStructure([
            'status',
            'message',
            'contracts',
            'meta' => ['total', 'current_page', 'last_page', 'per_page']
        ])
        ->assertJsonCount(5, 'contracts')
        ->assertJsonPath('meta.total', 5);
});

it('can search contracts', function () {
    $contract = Contract::factory()->create([
        'organization_id' => $this->organization->id,
        'title' => 'Specific Search Term'
    ]);
    Contract::factory()->create([
        'organization_id' => $this->organization->id,
        'title' => 'Another item'
    ]);

    $response = getJson('/api/contract?search=Specific');

    $response->assertOk()
        ->assertJsonCount(1, 'contracts')
        ->assertJsonPath('contracts.0.id', $contract->id);
});

it('creates a new contract', function () {
    $category = ContractCategory::where('slug', 'graduation')->first();
    $contractData = [
        'title' => 'Contrato de Formatura 2025',
        'code' => 'FORM-2025-01',
        'country' => 'BR',
        'state' => 'SP',
        'city' => 'São Paulo',
        'category' => $category->slug,

        // Graduation specific fields
        'type' => 'university',
        'institution_name' => 'Universidade de São Paulo',
        'institution_acronym' => 'USP',
        'class' => 'Turma 123',
        'shift' => 'night',
        'conclusion_year' => '2025',
        'university_course' => 'Ciência da Computação',
    ];

    $response = postJson('/api/contract', $contractData);

    $response
        ->assertOk()
        ->assertJson([
            'status' => 'success',
            'message' => 'Contract created',
        ])
        ->assertJsonStructure(['contract']);

    $this->assertDatabaseHas('contracts', [
        'organization_id' => $this->organization->id,
        'title' => 'Contrato de Formatura 2025',
        'code' => 'FORM-2025-01',
    ]);
});

it('fails to store with invalid data', function () {
    $response = postJson('/api/contract', ['start_date' => 'invalid-date']);

    $response->assertStatus(422);
});

it('returns a specific contract', function () {
    $contract = Contract::factory()->create(['organization_id' => $this->organization->id]);

    $response = getJson("/api/contract/{$contract->id}");

    $response->assertOk()
        ->assertJson([
            'status' => 'success',
            'contract' => [
                'id' => $contract->id
            ]
        ]);
});

it('fails to show a contract from another organization', function () {
    $contract = Contract::factory()->create();

    $response = getJson("/api/contract/{$contract->id}");

    $response->assertForbidden();
});

it('updates an existing contract', function () {
    $contract = Contract::factory()->create(['organization_id' => $this->organization->id]);

    $updateData = [
        'title' => 'Título do Contrato Atualizado',
        'code' => $contract->code,
        'country' => 'BR',
        'state' => 'RJ',
        'city' => 'Rio de Janeiro',
        'type' => 'school',
        'institution_name' => 'Colégio Pedro II',
        'class' => 'Turma 901',
        'shift' => 'morning',
        'conclusion_year' => '2026',
        'school_grade_level' => 'high_school',
    ];

    $response = putJson("/api/contract/{$contract->id}", $updateData);

    $response->assertOk()->assertJson(['status' => 'success', 'message' => 'Contract updated']);

    $this->assertDatabaseHas('contracts', [
        'id' => $contract->id,
        'title' => 'Título do Contrato Atualizado',
    ]);
});

it('fails to update a contract from another organization', function () {
    $contract = Contract::factory()->create();
    $updateData = ['title' => 'new title'];

    $response = putJson("/api/contract/{$contract->id}", $updateData);

    $response->assertForbidden();
});

it('deletes a contract', function () {
    $contract = Contract::factory()->create(['organization_id' => $this->organization->id]);

    $response = deleteJson("/api/contract/{$contract->id}");

    $response->assertOk()
        ->assertJson(['status' => 'success', 'message' => 'Contract deleted']);

    $this->assertDatabaseMissing('contracts', ['id' => $contract->id]);
});

it('fails to delete a contract from another organization', function () {
    $contract = Contract::factory()->create();

    $response = deleteJson("/api/contract/{$contract->id}");

    $response->assertForbidden();
});

it('returns all contract categories', function () {
    $count = ContractCategory::count();

    $response = getJson('/api/contract/categories');

    $response->assertOk()
        ->assertJsonStructure(['status', 'message', 'categories'])
        ->assertJsonCount($count, 'categories');
});