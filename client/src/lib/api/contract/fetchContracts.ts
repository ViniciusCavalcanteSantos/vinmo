import apiFetch from "@/lib/apiFetch";
import Contract from "@/types/Contract";
import {buildUrl} from "@/lib/http/buildUrl";

export interface FetchContractsResponse {
  contracts: Contract[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchContracts(page: number = 1, pageSize: number = 15, searchTerm?: string) {
  const url = buildUrl('/contract', {
    page: String(page),
    per_page: String(pageSize),
    search: searchTerm,
  })

  return await apiFetch<FetchContractsResponse>(url, {
    method: "GET",
  });
}
