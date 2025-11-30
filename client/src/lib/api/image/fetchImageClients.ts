import apiFetch from "@/lib/apiFetch";
import Client from "@/types/Client";

export async function fetchImageClients(imageId: string) {
  return await apiFetch<{ clients: Client[] }>(`/images/${imageId}/clients`, {
    method: "GET",
  });
}
