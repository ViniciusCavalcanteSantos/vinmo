import apiFetch from "@/lib/apiFetch";
import Contract from "@/types/Contract";

export interface FetchEventsResponse {
  contracts: Contract[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchContracts(params?: any) {
  return apiFetch<FetchEventsResponse>("/contract?" + new URLSearchParams(params).toString());
}