import {useQuery} from "@tanstack/react-query";
import {fetchEvent} from "@/lib/api/events/fetchEvent";

export function useEvent(eventId?: number, withContract: boolean = false) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => await fetchEvent(eventId!, withContract),
    select: (data) => data.event,
    enabled: !!eventId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
