"use client";

import {createContext, useContext, useState} from "react";
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
import EventType from "@/types/EventType";
import {ApiFetchResponse} from "@/lib/apiFetch";

interface UserDataContextType {
  events: EventType[];
  loadingEvents: boolean;
  fetchEvents: (page?: number, pageSize?: number, searchTerm?: string) => Promise<ApiFetchResponse<FetchEventsResponse>>;
  createEvent: (values: any) => Promise<ApiFetchResponse<CreateEventResponse>>;
  updateEvent: (id: number, values: any) => Promise<ApiFetchResponse<UpdateEventResponse>>;
  removeEvent: (id: number) => Promise<ApiFetchResponse>;
}

const EventsContext = createContext<UserDataContextType | undefined>(undefined);

export const EventsProvider = ({children}: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const fetchEvents = async (page: number = 1, pageSize: number = 15, searchTerm?: string) => {
    setLoadingEvents(true);
    const res = await fetchEventsApi(page, pageSize, searchTerm || "");
    if (res.status === ApiStatus.SUCCESS) {
      setEvents(res.events);
    }
    setLoadingEvents(false);
    return res;
  }

  const createEvent = async (values: any) => {
    const res = await createEventApi(values);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchEvents();
    }
    return res;
  };

  const updateEvent = async (id: number, values: any) => {
    const res = await updateEventApi(id, values);
    if (res.status === ApiStatus.SUCCESS) {
      await fetchEvents();
    }
    return res;
  };

  const removeEvent = async (id: number) => {
    const res = await removeEventApi(id);
    if (res.status === ApiStatus.SUCCESS) {
      setEvents(prev => prev.filter(c => c.id !== id));
    }
    return res;
  };

  return (
    <EventsContext.Provider
      value={{
        events,
        loadingEvents,
        fetchEvents,
        createEvent,
        updateEvent,
        removeEvent,
      }}
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
