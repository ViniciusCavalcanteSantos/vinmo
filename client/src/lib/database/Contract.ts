import apiFetch from "@/lib/apiFetch";
import ContractType from "@/types/ContractType";

export async function getContracts(){
  const data = await apiFetch<{contracts: ContractType[]}>("/contract", {
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