import apiFetch from "@/lib/apiFetch";
import {CreateEventResponse} from "@/lib/database/Event";


export interface FetchAssignmentsResponse {
  assignments: number[];
}

export async function fetchAssignments(clientId: number | string) {
  return await apiFetch<FetchAssignmentsResponse>(`/assignment/client/${clientId}`, {
    method: "GET",
  });
}


export async function createAssignment(clientId: number | string, assignments: number[]) {
  return await apiFetch<CreateEventResponse>(`/assignment/client/${clientId}`, {
    method: "POST",
    body: JSON.stringify({assignments}),
  });
}
