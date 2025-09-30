import apiFetch from "@/lib/apiFetch";
import EventType from "@/types/EventType";

export interface FetchEventsResponse {
  events: EventType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}


export interface FetchEventTypesResponse {
  eventTypes: {
    id: number,
    name: string,
  }[];
}

export interface CreateEventResponse {
  event: EventType
}

export interface UpdateEventResponse {
  event: EventType
}

export async function fetchEvents(page: number, pageSize: number, searchTerm: string) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize)
  });

  if (searchTerm) {
    query.append('search', searchTerm);
  }

  return await apiFetch<FetchEventsResponse>(`/event?${query.toString()}`, {
    method: "GET",
  });
}


export async function fetchEventTypes(contractId: number) {
  return await apiFetch<FetchEventTypesResponse>(`/event/types/${contractId}`, {
    method: "GET",
  });
}

export async function createEvent(values: any) {
  const data = await apiFetch<CreateEventResponse>("/event", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return data;
}


export async function updateEvent(id: number, values: any) {
  const data = await apiFetch<UpdateEventResponse>(`/event/${id}`, {
    method: "PUT",
    body: JSON.stringify(values),
  });

  return data;
}

export async function removeEvent(id: number) {
  const data = await apiFetch(`/event/${id}`, {
    method: "DELETE",
  });

  return data;
}