import apiFetch from "@/lib/apiFetch";

export async function getCountries() {
  return await apiFetch<{ countries: { value: string, label: string }[] }>("/locations/countries", {
    method: "GET",
  });
}

export async function getStates(country_cca2: string) {
  return await apiFetch<{ states: { value: string, label: string }[] }>(`/locations/countries/${country_cca2}/states`, {
    method: "GET"
  });
}

export async function getCities(country_cca2: string, state_code: string) {
  return await apiFetch<{
    cities: { value: string, label: string }[]
  }>(`/locations/countries/${country_cca2}/states/${state_code}/cities`, {
    method: "GET"
  });
}

export async function getCategories() {
  return await apiFetch<{ categories: { name: string, slug: string }[] }>(`/contract/categories`, {
    method: "GET"
  });
}