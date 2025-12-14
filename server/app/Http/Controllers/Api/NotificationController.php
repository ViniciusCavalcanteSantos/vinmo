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

    public function read(Request $request, $id)
    {
        $notification = $request->user()->notifications()->findOrFail($id);
        $notification->markAsRead();

        return response()->json([
            'status' => 'success',
            'message' => 'Notifications updated successfully',
        ]);
    }

    public function readAll(Request $request)
    {
        $request->user()->unreadNotifications->markAsRead();
        return response()->json([
            'status' => 'success',
            'message' => 'Notifications updated successfully',
        ]);
    }

    public function dismiss(Request $request, $id)
    {
        $request->user()->notifications()->find($id)?->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Notification dismissed successfully',
        ]);
    }
}
