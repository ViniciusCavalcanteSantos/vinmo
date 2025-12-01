import apiFetch from "@/lib/apiFetch";

export async function assignClient(clientId: number | string, assignments: number[]) {
  return await apiFetch(`/client/${clientId}/assignment`, {
    method: "POST",
    body: JSON.stringify({assignments}),
  });
}