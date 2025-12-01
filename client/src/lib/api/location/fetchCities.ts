import apiFetch from "@/lib/apiFetch";

export async function fetchCities(country_cca2: string, state_code: string) {
  return await apiFetch<{
    cities: { value: string, label: string }[]
  }>(`/locations/countries/${country_cca2}/states/${state_code}/cities`, {
    method: "GET"
  });
}