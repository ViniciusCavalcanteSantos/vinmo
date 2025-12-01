import apiFetch from "@/lib/apiFetch";

export async function fetchStates(country_cca2: string) {
  return await apiFetch<{ states: { value: string, label: string }[] }>(`/locations/countries/${country_cca2}/states`, {
    method: "GET"
  });
}