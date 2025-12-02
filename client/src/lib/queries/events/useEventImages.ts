import {useQuery} from "@tanstack/react-query";
import {fetchEventImages} from "@/lib/api/events/fetchEventImages";
import {ApiStatus} from "@/types/ApiResponse";

export function useEventImages(eventId?: number) {
  return useQuery({
    queryKey: ["events", eventId, "images"],
    enabled: !!eventId,
    queryFn: async () => await fetchEventImages(eventId!),
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.images : [],
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });
}