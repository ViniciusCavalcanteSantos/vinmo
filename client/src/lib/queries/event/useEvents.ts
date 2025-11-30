import {useQuery} from "@tanstack/react-query";
import {fetchEvents} from "@/lib/api/event/fetchEvents";
import {ApiStatus} from "@/types/ApiResponse";

export function useEvents(search: string = '', page: number = 1, pageSize: number = 15) {
  return useQuery({
    queryKey: ["events", search, page, pageSize],
    queryFn: () => fetchEvents({
      page,
      pageSize,
      search,
    }),
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.events : [],
  });
}
