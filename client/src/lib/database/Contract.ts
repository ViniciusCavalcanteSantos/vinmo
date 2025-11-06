import apiFetch from "@/lib/apiFetch";
import Contract from "@/types/Contract";

export interface FetchContractsResponse {
  contracts: Contract[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateContractResponse {
  contract: Contract
}

export interface UpdateContractResponse {
  contract: Contract
}


export async function fetchContracts(page: number = 1, pageSize: number = 15, searchTerm?: string) {
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize)
  });

  if (searchTerm) {
    query.append('search', searchTerm);
  }

  return await apiFetch<FetchContractsResponse>(`/contract?${query.toString()}`, {
    method: "GET",
  });
}

export async function createContract(values: any) {
  return await apiFetch<CreateContractResponse>("/contract", {
    method: "POST",
    body: JSON.stringify(values),
  });
}


export async function updateContract(id: number, values: any) {
  return await apiFetch<UpdateContractResponse>(`/contract/${id}`, {
    method: "PUT",
    body: JSON.stringify(values),
  });
}

export async function removeContract(id: number) {
  return await apiFetch(`/contract/${id}`, {
    method: "DELETE",
  });
}