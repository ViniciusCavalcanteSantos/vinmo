import {useQuery} from "@tanstack/react-query";
import {fetchClient} from "@/lib/api/clients/fetchClient";

export function useClient(clientId?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => await fetchClient(clientId!),
    enabled: !!clientId && enabled,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
