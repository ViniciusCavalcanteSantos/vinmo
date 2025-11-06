"use client";

import {createContext, useCallback, useContext, useMemo, useState} from "react";
import {
  createEvent as createEventApi,
  CreateEventResponse,
  fetchEvents as fetchEventsApi,
  FetchEventsResponse,
  removeEvent as removeEventApi,
  updateEvent as updateEventApi,
  UpdateEventResponse,
} from "@/lib/database/Event";
import {ApiStatus} from "@/types/ApiResponse";
import Event from "@/types/Event";
import {ApiFetchResponse} from "@/lib/apiFetch";

interface UserDataContextType {
  events: Event[];
  loadingEvents: boolean;
  fetchEvents: (...args: Parameters<typeof fetchEventsApi>) => Promise<ApiFetchResponse<FetchEventsResponse>>;
  createEvent: (...args: Parameters<typeof createEventApi>) => Promise<ApiFetchResponse<CreateEventResponse>>;
  updateEvent: (...args: Parameters<typeof updateEventApi>) => Promise<ApiFetchResponse<UpdateEventResponse>>;
  removeEvent: (...args: Parameters<typeof removeEventApi>) => Promise<ApiFetchResponse>;
}

const EventsContext = createContext<UserDataContextType | undefined>(undefined);

export const EventsProvider = ({children}: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const fetchEvents = useCallback(async (...args: Parameters<typeof fetchEventsApi>) => {
    setLoadingEvents(true);
    const res = await fetchEventsApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      setEvents(res.events);
    }
    setLoadingEvents(false);
    return res;
  }, [])

  const createEvent = useCallback(async (...args: Parameters<typeof createEventApi>) => {
    const res = await createEventApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchEvents();
    }
    return res;
  }, [fetchEvents]);

  const updateEvent = useCallback(async (...args: Parameters<typeof updateEventApi>) => {
    const res = await updateEventApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchEvents();
    }
    return res;
  }, [fetchEvents]);

  const removeEvent = useCallback(async (...args: Parameters<typeof removeEventApi>) => {
    const res = await removeEventApi(...args);
    if (res.status === ApiStatus.SUCCESS) {
      setEvents(prev => prev.filter(c => c.id !== args[0]));
    }
    return res;
  }, []);

  const value = useMemo(() => ({
    events,
    loadingEvents,
    fetchEvents,
    createEvent,
    updateEvent,
    removeEvent,
  }), [events, loadingEvents, fetchEvents, createEvent, updateEvent, removeEvent]);

  return (
    <EventsContext.Provider
      value={value}
    >
      {children}
    </EventsContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within a EventsProvider");
  }
  return context;
};
