import apiFetch from "@/lib/apiFetch";

export interface FetchAssignmentsResponse {
  assignments: number[];
}

export async function fetchAssignments(clientId: number | string) {
  return await apiFetch<FetchAssignmentsResponse>(`/clients/${clientId}/assignments`, {
    method: "GET",
  });
}