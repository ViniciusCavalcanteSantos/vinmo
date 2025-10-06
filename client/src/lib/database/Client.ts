import apiFetch from "@/lib/apiFetch";
import ClientType from "@/types/ClientType";

export interface FetchClientsResponse {
  clients: ClientType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface FetchClientResponse {
  client: ClientType;
}

export interface CreateClientResponse {
  client: ClientType
}

export interface UpdateClientResponse {
  client: ClientType
}


export async function fetchClients(page: number, pageSize: number, searchTerm?: string) {
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

export async function fetchClient(id: number) {
  return await apiFetch<FetchClientResponse>(`/client/${id}`, {
    method: "GET",
  });
}

export async function createClient(values: any) {
  const data = await apiFetch<CreateClientResponse>("/client", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return data;
}

export async function updateClient(id: number, values: any) {
  const data = await apiFetch<UpdateClientResponse>(`/client/${id}`, {
    method: "PUT",
    body: JSON.stringify(values),
  });

  return data;
}

export async function removeClient(id: number) {
  const data = await apiFetch(`/client/${id}`, {
    method: "DELETE",
  });

  return data;
}