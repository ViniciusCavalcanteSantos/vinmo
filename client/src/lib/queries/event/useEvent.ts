import {useQuery} from "@tanstack/react-query";
import {fetchEvent} from "@/lib/api/event/fetchEvent";
import {ApiStatus} from "@/types/ApiResponse";

export function useFetchEvent(eventId?: number, withContract: boolean = false) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: () => {
      if (!eventId) throw new Error("Missing eventId");
      return fetchEvent(eventId, withContract);
    },
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.event : null,
    enabled: !!eventId,
  });
}
