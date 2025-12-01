import apiFetch from "@/lib/apiFetch";

export async function removeClient(id: number) {
  return await apiFetch(`/client/${id}`, {
    method: "DELETE",
  });
}