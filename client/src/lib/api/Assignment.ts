import apiFetch from "@/lib/apiFetch";


export interface FetchAssignmentsResponse {
  assignments: number[];
}

export async function fetchAssignments(clientId: number | string) {
  return await apiFetch<FetchAssignmentsResponse>(`/assignment/client/${clientId}`, {
    method: "GET",
  });
}


export async function assignClient(clientId: number | string, assignments: number[]) {
  return await apiFetch(`/assignment/client/${clientId}`, {
    method: "POST",
    body: JSON.stringify({assignments}),
  });
}

export async function assignClientBulk(clientIds: number[] | string, assignments: number[]) {
  return await apiFetch(`/assignment/bulk`, {
    method: "POST",
    body: JSON.stringify({
      client_ids: clientIds,
      assignments
    }),
  });
}

export async function unassignClientBulk(clientIds: number[] | string, assignments: number[]) {
  return await apiFetch(`/assignment/bulk`, {
    method: "DELETE",
    body: JSON.stringify({
      client_ids: clientIds,
      assignments
    }),
  });
}
