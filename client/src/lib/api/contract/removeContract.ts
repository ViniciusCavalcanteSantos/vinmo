import apiFetch from "@/lib/apiFetch";

export async function removeContract(id: number) {
  return apiFetch(`/contracts/${id}`, {
    method: "DELETE",
  });
}
