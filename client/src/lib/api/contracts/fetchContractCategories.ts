import apiFetch from "@/lib/apiFetch";

export async function fetchContractCategories() {
  return await apiFetch<{ categories: { name: string, slug: string }[] }>(`/contracts/categories`, {
    method: "GET"
  });
}