import apiFetch from "@/lib/apiFetch";
import Client from "@/types/Client";

export interface FetchClientsResponse {
  clients: Client[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchClients(page: number = 1, pageSize: number = 15, searchTerm?: string) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize)
  });

  if (searchTerm) {
    query.append('search', searchTerm);
  }

  return await apiFetch<FetchClientsResponse>(`/client?${query.toString()}`, {
    method: "GET",
  });
}
