import {useQuery} from "@tanstack/react-query";
import {fetchEvents} from "@/lib/api/event/fetchEvents";
import {ApiStatus} from "@/types/ApiResponse";

export function useEvents(search: string = '', page: number = 1, page_size: number = 15, with_contract: boolean = false) {
  return useQuery({
    queryKey: ["events", search, page, page_size],
    queryFn: () => fetchEvents(
      page,
      page_size,
      search,
      with_contract
    ),
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.events : [],
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
}
