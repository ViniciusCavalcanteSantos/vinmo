<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventPhotoRequest;
use App\Models\Event;
use App\Services\EventPhotoService;
use Illuminate\Validation\ValidationException;

class EventPhotoController extends Controller
{
    public function store(EventPhotoRequest $request, EventPhotoService $eventService)
    {
        $eventId = $request->input('event_id');
        $event = Event::find($eventId);

        if (!$event) {
            return response()->json([
                'status' => 'error',
                'message' => __('Not Found')
            ], 404);
        }

        try {
            $eventService->uploadPhoto($request, $event);
            $event->load('type');
            return response()->json([
                'status' => 'success',
                'message' => __('Photo uploaded'),
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
}
