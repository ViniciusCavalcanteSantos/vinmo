<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AssignmentController extends Controller
{

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, Client $client)
    {
        $validator = Validator::make($request->all(), [
            'assignments' => 'array',
            'assignments.*' => 'integer|exists:events,id',
        ], [
            'assignments.*.exists' => __('The selected event was not found in the system'),
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }
        $validated = $validator->validated();

        try {
            $client->events()->sync($validated['assignments']);
            return response()->json([
                'status' => 'success',
                'message' => __('Assignments updated')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function storeBulk(Request $request)
    {
        $validator = $this->validateBulk($request);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }
        $validated = $validator->validated();

        try {
            foreach ($validated['client_ids'] as $clientId) {
                $client = Client::find($clientId);
                $client->events()->syncWithoutDetaching($validated['assignments']);
            }

            return response()->json([
                'status' => 'success',
                'message' => __('Assignments updated')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    public function validateBulk(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'client_ids' => 'required|array',
            'client_ids.*' => 'integer|exists:clients,id',
            'assignments' => 'required|array',
            'assignments.*' => 'integer|exists:events,id',
        ], [
            'client_ids.*.exists' => __('The selected client was not found in the system'),
            'assignments.*.exists' => __('The selected event was not found in the system'),
        ]);

        return $validator;
    }

    /**
     * Store a newly created resource in storage.
     */
    public function destroyBulk(Request $request)
    {
        $validator = $this->validateBulk($request);
        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors()->first()
            ], 422);
        }
        $validated = $validator->validated();

        try {
            foreach ($validated['client_ids'] as $clientId) {
                $client = Client::find($clientId);
                $client->events()->detach($validated['assignments']);
            }

            return response()->json([
                'status' => 'success',
                'message' => __('Assignments updated')
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
            'message' => __('Assignments retrieved'),
            'assignments' => $client->events()->pluck('event_id')->toArray()
        ]);
    }
}
