import {useQuery} from "@tanstack/react-query";
import {fetchAvailableProviders} from "@/lib/api/users/fetchAvailableProviders";

export function useAvailableProviders() {
  return useQuery({
    queryKey: ['available-providers'],
    queryFn: () => fetchAvailableProviders(),
    select: (res) => res.providers,
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  })
}