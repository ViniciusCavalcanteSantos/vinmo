import apiFetch from "@/lib/apiFetch";
import Event from "@/types/Event";

export interface UpdateEventResponse {
  event: Event
}

export async function updateEvent(id: number, data: any) {
  return apiFetch<UpdateEventResponse>(`/events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}