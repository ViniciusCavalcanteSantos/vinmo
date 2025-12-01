import {useQuery} from "@tanstack/react-query";
import {fetchEvent} from "@/lib/api/events/fetchEvent";
import {ApiStatus} from "@/types/ApiResponse";

export function useEvent(eventId?: number, withContract: boolean = false) {
  return useQuery({
    queryKey: ["event", eventId],
    queryFn: async () => {
      if (!eventId) throw new Error("Missing eventId");
      const res = await fetchEvent(eventId, withContract)
      if (res.status !== ApiStatus.SUCCESS) throw new Error(res.message);
      return res.event;
    },
    enabled: !!eventId,
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}
