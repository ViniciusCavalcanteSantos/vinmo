<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\ClientService;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user_id = auth()->id();
        $perPage = $request->input('per_page', 15);
        $searchTerm = $request->input('search');

        $clientsQuery = Client
            ::where('user_id', $user_id)
            ->with(['address'])
            ->latest();

//        $clientsQuery->when($searchTerm, function ($query, $term) {
//            $query->where('searchable', "LIKE", "%{$term}%");
//        });

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
            $client->load('category', 'address', 'graduationDetail');
            return response()->json([
                'status' => 'success',
                'message' => __('Client updated'),
                'client' => new ClientResource($client)
            ]);

        } catch (\Exception $e) {
            var_dump($e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $client = Client::find($id);
        if (!$client) {
            return response()->json([
                'status' => 'error',
                'message' => __('Client not found')
            ], 404);
        }

        if (!$client->delete()) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => __('Client deleted')
        ]);
    }
}
