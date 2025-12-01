import apiFetch from "@/lib/apiFetch";

export async function unassignClientBulk(clientIds: number[] | string, assignments: number[]) {
  return await apiFetch(`/clients/assignments/bulk`, {
    method: "DELETE",
    body: JSON.stringify({
      client_ids: clientIds,
      assignments
    }),
  });
}
