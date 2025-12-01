import apiFetch from "@/lib/apiFetch";
import Event from "@/types/Event";
import {buildUrl} from "@/lib/http/buildUrl";

export interface FetchEventResponse {
  event: Event;
}

export async function fetchEvent(eventId: number, withContract: boolean = false) {
  const url = buildUrl(`/events/${eventId}`, {
    with_contract: withContract
  });

  return await apiFetch<FetchEventResponse>(url, {
    method: "GET",
  });
}