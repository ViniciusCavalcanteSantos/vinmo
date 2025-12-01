import {useQuery} from "@tanstack/react-query";
import {fetchCities} from "@/lib/api/locations/fetchCities";

export function useCities(country?: string, state?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['locations', 'cities', `${country}-${state}`],
    queryFn: () => fetchCities(country!, state!),
    select: (res) => res.cities,
    enabled: !!country && !!state && enabled,
    staleTime: Infinity
  })
}