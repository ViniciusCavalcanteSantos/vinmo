<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContractRequest;
use App\Models\Contract;
use App\Models\ContractCategory;
use App\Services\ContractService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ContractController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreContractRequest $request, ContractService $contractService)
    {
        try {
            $contract = $contractService->createContract($request);
            return response()->json([
                'status' => 'success',
                'message' => __('Contract created!'),
                'contract' => $contract
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
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
