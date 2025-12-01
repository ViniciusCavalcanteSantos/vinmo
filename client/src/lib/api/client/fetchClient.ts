import apiFetch from "@/lib/apiFetch";
import Client from "@/types/Client";

export interface FetchClientResponse {
  client: Client;
}

export async function fetchClient(id: number) {
  return await apiFetch<FetchClientResponse>(`/clients/${id}`, {
    method: "GET",
  });
}