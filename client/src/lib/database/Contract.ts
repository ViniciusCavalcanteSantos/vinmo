import apiFetch from "@/lib/apiFetch";
import ContractType from "@/types/ContractType";

export interface PaginatedContractsResponse {
  contracts: ContractType[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function getContracts(page: number, pageSize: number){
  const query = new URLSearchParams({
    page: String(page),
    per_page: String(pageSize)
  }).toString();

  const data = await apiFetch<PaginatedContractsResponse>(`/contract?${query}`, {
    method: "GET",
  });

  return data;
}

export async function createContract(values: any){
  const data = await apiFetch<{contract: ContractType}>("/contract", {
    method: "POST",
    body: JSON.stringify( values ),
  });

  return data;
}