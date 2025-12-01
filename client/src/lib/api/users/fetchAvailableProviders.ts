import apiFetch from "@/lib/apiFetch";

export async function fetchAvailableProviders() {
  return await apiFetch<{ providers: Array<string> }>(`/auth/available-providers`, {
    method: "GET",
  });
}