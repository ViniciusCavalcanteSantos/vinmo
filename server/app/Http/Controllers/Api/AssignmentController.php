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
