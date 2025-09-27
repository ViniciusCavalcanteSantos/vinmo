import apiFetch from "@/lib/apiFetch";

export async function createContract(values: any){
  const data = await apiFetch("/contract", {
    method: "POST",
    body: JSON.stringify( values ),
  });

  return data;
}