import apiFetch from "@/lib/apiFetch";

export async function fetchCountries() {
  return await apiFetch<{ countries: { value: string, label: string }[] }>("/locations/countries", {
    method: "GET",
  });
}