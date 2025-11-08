<?php

namespace App\Services;

use App\Http\Requests\EventRequest;
use App\Models\Event;
use Illuminate\Support\Facades\DB;

class EventService
{
    public function createEvent(EventRequest $request): Event
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            $event = Event::create([
                'organization_id' => auth()->user()->organization_id,
                'contract_id' => $validated['contract'],
                'type_id' => $validated['event_type'],
                'event_date' => $validated['event_date'],
                'start_time' => $validated['event_start_time'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            return $event;
        });
    }

    public function updateEvent(Event $event, EventRequest $request): Event
    {
        $validated = $request->validated();

        return DB::transaction(function () use ($validated, $event) {
            $event->update([
                'contract_id' => $validated['contract'],
                'type_id' => $validated['event_type'],
                'event_date' => $validated['event_date'],
                'start_time' => $validated['event_start_time'] ?? null,
                'description' => $validated['description'] ?? null,
            ]);

            return $event;
        });
    }
}