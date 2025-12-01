import {useQuery} from "@tanstack/react-query";
import {fetchStates} from "@/lib/api/location/fetchStates";

export function useStates(country?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ['locations', 'states', country],
    queryFn: () => fetchStates(country!),
    enabled: !!country && enabled,
    select: (res) => res.states,
    staleTime: Infinity
  })
}