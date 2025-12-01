import {useQuery} from "@tanstack/react-query";
import {fetchClients} from "@/lib/api/clients/fetchClients";
import {ApiStatus} from "@/types/ApiResponse";

export function useClients(search: string = '', page: number = 1, page_size: number = 15) {
  return useQuery({
    queryKey: ["clients", search, page, page_size],
    queryFn: () => fetchClients(
      page,
      page_size,
      search
    ),
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.clients : [],
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
}
