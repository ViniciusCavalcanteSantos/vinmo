import {useQuery} from "@tanstack/react-query";
import {fetchCountries} from "@/lib/api/locations/fetchCountries";

export function useCountries(enabled: boolean = true) {
  return useQuery({
    queryKey: ['locations', 'countries'],
    queryFn: () => fetchCountries(),
    enabled: enabled,
    select: (res) => res.countries,
    staleTime: Infinity
  })
}