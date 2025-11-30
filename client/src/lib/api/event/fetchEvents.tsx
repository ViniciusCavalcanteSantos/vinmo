import apiFetch from "@/lib/apiFetch";
import Event from "@/types/Event";

export interface FetchEventsResponse {
  events: Event[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchEvents(params?: any) {
  return apiFetch<FetchEventsResponse>("/event?" + new URLSearchParams(params).toString());
}