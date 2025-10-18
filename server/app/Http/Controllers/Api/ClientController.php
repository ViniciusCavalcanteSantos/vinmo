<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Models\ClientRegisterLink;
use App\Services\ClientService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $organizationId = auth()->user()->organization_id;
        $perPage = $request->input('per_page', 15);
        $searchTerm = $request->input('search');

        $clientsQuery = Client
            ::where('organization_id', $organizationId)
            ->with(['address'])
            ->latest();

        $clientsQuery->when($searchTerm, function ($query, $term) {
            $query->where('searchable', "LIKE", "%{$term}%");
        });

        $clients = $clientsQuery->paginate($perPage);
        return response()->json([
            'status' => 'success',
            'message' => __('Clients retrieved successfully'),
            'clients' => ClientResource::collection($clients),
            'meta' => [
                'total' => $clients->total(),
                'current_page' => $clients->currentPage(),
                'last_page' => $clients->lastPage(),
                'per_page' => $clients->perPage(),
                'from' => $clients->firstItem(),
                'to' => $clients->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ClientRequest $request, ClientService $clientService)
    {
        try {
            $client = $clientService->createClient($request);
            $client->load('address');
            return response()->json([
                'status' => 'success',
                'message' => __('Client created'),
                'client' => new ClientResource($client)
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Client $client)
    {
        $client->load('address');
        return response()->json([
            'status' => 'success',
            'message' => __('Client retrieved'),
            'client' => new ClientResource($client)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ClientRequest $request, Client $client, ClientService $clientService)
    {
        try {
            $client = $clientService->updateClient($client, $request);
            $client->load('address');
            return response()->json([
                'status' => 'success',
                'message' => __('Client updated'),
                'client' => new ClientResource($client)
            ]);
        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(ClientService $clientService, string $id)
    {
        $client = Client::find($id);
        if (!$client) {
            return response()->json([
                'status' => 'success',
                'message' => __('Client deleted')
            ]);
        }

        try {
            $clientService->deleteClient($client);

            return response()->json([
                'status' => 'success',
                'message' => __('Client deleted')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ], 500);
        }
    }

    public function generateLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|min:3|max:80',
            'require_address' => 'required|boolean',
            'require_guardian_if_minor' => 'required|boolean',
            'inform_max_clients' => 'required|boolean',
            'max_registers' => 'sometimes|integer|min:1|max:999',
            'assignments' => 'sometimes|array',
            'assignments.*' => 'integer|exists:events,id',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }
        $validated = $validator->validated();
        try {
            $registerLink = ClientRegisterLink::create([
                ...$validated,
                'default_assignments' => $validated['assignments'],
                'organization_id' => auth()->user()->organization_id,
            ]);

            return response()->json([
                'status' => 'success',
                'message' => __('Link created'),
                'link_id' => base64_encode($registerLink->id),
            ], 201);

        } catch (\Exception $e) {
            Log::error('Falha ao criar link de cadastro: '.$e->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => __('Could not generate link')
            ], 500);
        }
    }
}
