import apiFetch from "@/lib/apiFetch";

export async function assignClient(clientId: number | string, assignments: number[]) {
  return await apiFetch(`/clients/${clientId}/assignments`, {
    method: "POST",
    body: JSON.stringify({assignments}),
  });
}