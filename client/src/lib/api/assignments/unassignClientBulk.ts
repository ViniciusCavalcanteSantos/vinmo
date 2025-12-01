import apiFetch from "@/lib/apiFetch";

export async function unassignClientBulk(clientIds: number[] | string, assignments: number[]) {
  return await apiFetch(`client/assignment/bulk`, {
    method: "DELETE",
    body: JSON.stringify({
      client_ids: clientIds,
      assignments
    }),
  });
}
