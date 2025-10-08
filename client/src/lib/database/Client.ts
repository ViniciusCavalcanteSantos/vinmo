import apiFetch from "@/lib/apiFetch";
import ClientType from "@/types/ClientType";
import {UploadFile} from "antd";
import {objectToFormData} from "@/lib/objectToFormData";

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

export async function createClient(values: any, profile: UploadFile) {
  const formData = objectToFormData(values)
  if (profile.originFileObj) {
    formData.append("profile", profile.originFileObj);
  }

  return await apiFetch<CreateClientResponse>("/client", {
    method: "POST",
    body: formData,
  });
}

export async function updateClient(id: number, values: any, profile: UploadFile) {
  const formData = objectToFormData(values)
  if (profile.originFileObj) {
    formData.append("profile", profile.originFileObj);
  }

  formData.append("_method", "PUT");
  return await apiFetch<UpdateClientResponse>(`/client/${id}`, {
    method: "POST",
    body: formData
  });
}

export async function removeClient(id: number) {
  return await apiFetch(`/client/${id}`, {
    method: "DELETE",
  });
}