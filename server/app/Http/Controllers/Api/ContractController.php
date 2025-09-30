<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContractRequest;
use App\Http\Requests\UpdateContractRequest;
use App\Http\Resources\ContractResource;
use App\Models\Contract;
use App\Models\ContractCategory;
use App\Services\ContractService;
use Illuminate\Http\Request;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user_id = auth()->id();
        $perPage = $request->input('per_page', 15);
        $searchTerm = $request->input('search');

        $contractsQuery = Contract
            ::where('user_id', $user_id)
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
    public function store(StoreContractRequest $request, ContractService $contractService)
    {
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
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateContractRequest $request, Contract $contract, ContractService $contractService)
    {
        try {
            $contract = $contractService->updateContract($contract, $request);
            $contract->load('category', 'address', 'graduationDetail');
            return response()->json([
                'status' => 'success',
                'message' => __('Contract updated'),
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
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $contract = Contract::find($id);
        if (!$contract) {
            return response()->json([
                'status' => 'error',
                'message' => __('Contract not found')
            ], 404);
        }

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
