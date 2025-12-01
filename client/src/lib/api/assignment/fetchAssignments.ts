import apiFetch from "@/lib/apiFetch";

export interface FetchAssignmentsResponse {
  assignments: number[];
}

export async function fetchAssignments(clientId: number | string) {
  return await apiFetch<FetchAssignmentsResponse>(`/client/${clientId}/assignment`, {
    method: "GET",
  });
}