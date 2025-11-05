import apiFetch from "@/lib/apiFetch";
import EventType from "@/types/EventType";
import {UploadFile} from "antd";
import {objectToFormData} from "@/lib/objectToFormData";
import {CreateClientResponse} from "@/lib/database/Client";
import ImageType from "@/types/ImageType";

export interface FetchEventsResponse {
  events: EventType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FetchEventResponse {
  event: EventType;
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

export async function fetchEvents(page: number = 1, pageSize: number = 15, searchTerm?: string, withContract: boolean = false) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize)
  });

  if (searchTerm) {
    query.append('search', searchTerm);
  }

  if (withContract) {
    query.append('with_contract', 'true');
  }

  return await apiFetch<FetchEventsResponse>(`/event?${query.toString()}`, {
    method: "GET",
  });
}

export async function fetchEvent(eventId: number, withContract: boolean = false) {
  const query = new URLSearchParams();

  if (withContract) {
    query.append('with_contract', 'true');
  }

  return await apiFetch<FetchEventResponse>(`/event/${eventId}?${query.toString()}`, {
    method: "GET",
  });
}

export async function fetchEventImages(eventId: number) {
  const query = new URLSearchParams();

  return await apiFetch<{ images: ImageType[] }>(`/event/${eventId}/images`, {
    method: "GET",
  });
}

export async function fetchEventTypes(contractId: number) {
  return await apiFetch<FetchEventTypesResponse>(`/event/types/${contractId}`, {
    method: "GET",
  });
}

export async function createEvent(values: any) {
  return await apiFetch<CreateEventResponse>("/event", {
    method: "POST",
    body: JSON.stringify(values),
  });
}


export async function updateEvent(id: number, values: any) {
  return await apiFetch<UpdateEventResponse>(`/event/${id}`, {
    method: "PUT",
    body: JSON.stringify(values),
  });
}

export async function removeEvent(id: number) {
  return await apiFetch(`/event/${id}`, {
    method: "DELETE",
  });
}

export async function eventPhotoUpload(
  eventId: number | string,
  photo: UploadFile | File | Blob,
  onProgress?: (progress: number) => void
) {
  const formData = objectToFormData({event_id: eventId}, {'photo': photo})

  return apiFetch<CreateClientResponse>("/event/photo", {
    method: "POST",
    body: formData,
    driver: 'axios',
    onProgress
  });
}
