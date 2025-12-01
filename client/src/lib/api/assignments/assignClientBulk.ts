import apiFetch from "@/lib/apiFetch";

export async function assignClientBulk(clientIds: number[] | string, assignments: number[]) {
  return await apiFetch(`client/assignment/bulk`, {
    method: "POST",
    body: JSON.stringify({
      client_ids: clientIds,
      assignments
    }),
  });
}