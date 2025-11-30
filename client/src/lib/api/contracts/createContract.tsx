import apiFetch from "@/lib/apiFetch";
import Contract from "@/types/Contract";

export interface CreateContractResponse {
  contract: Contract
}

export async function createContract(data: any) {
  return apiFetch<CreateContractResponse>("/contract", {
    method: "POST",
    body: JSON.stringify(data),
  });
}