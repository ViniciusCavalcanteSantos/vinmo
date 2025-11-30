import apiFetch from "@/lib/apiFetch";
import Contract from "@/types/Contract";

export interface UpdateContractResponse {
  contract: Contract
}

export async function updateContract(id: number, data: any) {
  return apiFetch<UpdateContractResponse>(`/contract/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}