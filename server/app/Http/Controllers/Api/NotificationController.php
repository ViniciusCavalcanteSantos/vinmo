<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\NotificationResource;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json([
            'status' => 'success',
            'message' => 'Notifications obtained successfully',
            'notifications' => NotificationResource::collection($request->user()->notifications()->paginate(10))
        ]);
    }
}
