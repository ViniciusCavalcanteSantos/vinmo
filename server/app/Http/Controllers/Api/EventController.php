<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventRequest;
use App\Http\Resources\EventResource;
use App\Models\Contract;
use App\Models\Event;
use App\Models\EventType;
use App\Services\EventService;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request)
    {
        $organizationId = auth()->user()->organization_id;
        $perPage = $request->input('per_page', 15);
        $searchTerm = $request->input('search');

        $eventsQuery = Event
            ::whereIn('contract_id', function ($query) use ($organizationId) {
                $query->select('id')
                    ->from('contracts')
                    ->where('organization_id', $organizationId);
            })
            ->with('type')
            ->latest();

        $eventsQuery->when($searchTerm, function ($query, $term) {
            $query->where('searchable', "LIKE", "%{$term}%");
        });

        $events = $eventsQuery->paginate($perPage);
        return response()->json([
            'status' => 'success',
            'message' => __('Events retrieved successfully'),
            'events' => EventResource::collection($events),
            'meta' => [
                'total' => $events->total(),
                'current_page' => $events->currentPage(),
                'last_page' => $events->lastPage(),
                'per_page' => $events->perPage(),
                'from' => $events->firstItem(),
                'to' => $events->lastItem(),
            ],
        ]);
    }

    public function store(EventRequest $request, EventService $eventService)
    {
        try {
            $event = $eventService->createEvent($request);
            $event->load('type');
            return response()->json([
                'status' => 'success',
                'message' => __('Event created'),
                'event' => new EventResource($event)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    public function show(Event $event)
    {
        return response()->json([
            'status' => 'success',
            'message' => __('Event retrieved'),
            'event' => new EventResource($event)
        ]);
    }

    public function update(EventRequest $request, EventService $eventService, Event $event)
    {
        try {
            $event = $eventService->updateEvent($event, $request);
            $event->load('type');
            return response()->json([
                'status' => 'success',
                'message' => __('Event updated'),
                'event' => new EventResource($event)
            ]);
        } catch (\Exception $e) {
            var_dump($e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ]);
        }
    }

    public function destroy(Event $event)
    {
        if (!$event->delete()) {
            return response()->json([
                'status' => 'error',
                'message' => __('Could not perform action')
            ], 500);
        }

        return response()->json([
            'status' => 'success',
            'message' => __('Event deleted')
        ]);
    }

    public function getEventTypes(\Request $request, $contract_id)
    {
        $contract = Contract::find($contract_id);
        if (!$contract) {
            return response()->json([
                'success' => false,
                'message' => __('Not found')
            ], 404);
        }

        $eventTypes = EventType
            ::where('category_id', $contract->category_id)
            ->get()
            ->map(function ($eventType) {
                return [
                    'id' => $eventType->id,
                    'name' => __($eventType->name),
                ];
            });

        return response()->json([
            'status' => 'success',
            'message' => __('Event types retrieved'),
            'eventTypes' => $eventTypes
        ]);
    }
}
