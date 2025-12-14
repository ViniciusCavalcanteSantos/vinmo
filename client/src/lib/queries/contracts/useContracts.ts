import {useQuery} from "@tanstack/react-query";
import {fetchContracts} from "@/lib/api/contracts/fetchContracts";

export function useContracts(search: string = '', page: number = 1, pageSize: number = 15) {
  return useQuery({
    queryKey: ["contracts", search, page, pageSize],
    queryFn: () => fetchContracts(
      page,
      pageSize,
      search,
    ),
    select: (data) => data.contracts,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
}
