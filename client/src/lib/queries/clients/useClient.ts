import {useQuery} from "@tanstack/react-query";
import {fetchClient} from "@/lib/api/client/fetchClient";
import {ApiStatus} from "@/types/ApiResponse";

export function useClient(clientId?: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      if (!clientId) throw new Error("Missing clientId");
      const res = await fetchClient(clientId)
      if (res.status !== ApiStatus.SUCCESS) throw new Error(res.message);
      return res.client;
    },
    enabled: !!clientId && enabled,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
