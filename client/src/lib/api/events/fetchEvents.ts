import apiFetch from "@/lib/apiFetch";
import Event from "@/types/Event";
import {buildUrl} from "@/lib/http/buildUrl";

export interface FetchEventsResponse {
  events: Event[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchEvents(page: number = 1, pageSize: number = 15, searchTerm?: string, withContract: boolean = false) {
  const url = buildUrl('/events', {
    page: String(page),
    per_page: String(pageSize),
    search: searchTerm,
    with_contract: withContract
  })

  return await apiFetch<FetchEventsResponse>(url, {
    method: "GET",
  });
}