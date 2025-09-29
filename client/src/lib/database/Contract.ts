import apiFetch from "@/lib/apiFetch";
import ContractType from "@/types/ContractType";

export interface FetchContractsResponse {
  contracts: ContractType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface CreateContractResponse {
  contract: ContractType
}

export async function fetchContracts(page: number, pageSize: number, searchTerm: string) {
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
  const data = await apiFetch<CreateContractResponse>("/contract", {
    method: "POST",
    body: JSON.stringify(values),
  });

  return data;
}


export async function updateContract(values: any) {
}

export async function deleteContract(id: string) {
}