import apiFetch from "@/lib/apiFetch";

export interface FetchEventTypesResponse {
  eventTypes: {
    id: number,
    name: string,
  }[];
}

export async function fetchEventTypes(contractId: number) {
  return await apiFetch<FetchEventTypesResponse>(`/events/types/${contractId}`, {
    method: "GET",
  });
}
