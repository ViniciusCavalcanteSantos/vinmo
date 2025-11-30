import {useQuery} from "@tanstack/react-query";
import {ApiStatus} from "@/types/ApiResponse";
import {fetchContracts} from "@/lib/api/contract/fetchContracts";

export function useContracts(search: string = '', page: number = 1, pageSize: number = 15) {
  return useQuery({
    queryKey: ["contracts", search, page, pageSize],
    queryFn: () => fetchContracts({
      page,
      pageSize,
      search,
    }),
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.contracts : [],
  });
}
