<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ContractRequest;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use App\Models\ContractCategory;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $organizationId = auth()->user()->organization_id;
        $perPage = $request->input('per_page', 15);
        $searchTerm = $request->input('search');

        $contractsQuery = Contract
            ::where('organization_id', $organizationId)
            ->with(['category', 'address', 'graduationDetail'])
            ->latest();

        $contractsQuery->when($searchTerm, function ($query, $term) {
            $query->where('searchable', "LIKE", "%{$term}%");
        });

        $contracts = $contractsQuery->paginate($perPage);
        return response()->json([
            'status' => 'success',
            'message' => __('Contracts retrieved successfully'),
            'contracts' => ContractResource::collection($contracts),
            'meta' => [
                'total' => $contracts->total(),
                'current_page' => $contracts->currentPage(),
                'last_page' => $contracts->lastPage(),
                'per_page' => $contracts->perPage(),
                'from' => $contracts->firstItem(),
                'to' => $contracts->lastItem(),
            ],
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ContractRequest $request, ContractService $contractService)
    {
        Gate::authorize('create', Contract::class);

        try {
            $contract = $contractService->createContract($request);
            $contract->load('category', 'address', 'graduationDetail');
            return response()->json([
                'status' => 'success',
                'message' => __('Contract created'),
                'contract' => new ContractResource($contract)
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
    public function show(Contract $contract)
    {
        Gate::authorize('view', $contract);

        return response()->json([
            'status' => 'success',
            'message' => __('Contract retrieved'),
            'contract' => new ContractResource($contract)
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ContractRequest $request, Contract $contract, ContractService $contractService)
    {
        Gate::authorize('update', $contract);

        try {
            $contract = $contractService->updateContract($contract, $request);
            $contract->load('category', 'address', 'graduationDetail');
            return response()->json([
                'status' => 'success',
                'message' => __('Contract updated'),
                'contract' => new ContractResource($contract)
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
    public function destroy(Contract $contract)
    {
        Gate::authorize('delete', $contract);

        if (!$contract->delete()) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => __('Contract deleted')
        ]);
    }

    public function getCategories()
    {
        $categories = ContractCategory::all()->map(function ($category) {
            return [
                'name' => __($category->name),
                'slug' => $category->slug,
            ];
        });
        return response()->json([
            'status' => 'success',
            'message' => __('All categories obtained'),
            'categories' => $categories
        ]);
    }
}
