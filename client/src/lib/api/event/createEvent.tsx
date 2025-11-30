import apiFetch from "@/lib/apiFetch";
import Event from "@/types/Event";

export interface CreateEventResponse {
  event: Event
}

export async function createEvent(data: any) {
  return apiFetch<CreateEventResponse>("/event", {
    method: "POST",
    body: JSON.stringify(data),
  });
}