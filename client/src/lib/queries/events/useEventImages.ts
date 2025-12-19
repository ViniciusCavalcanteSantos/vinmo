import {useQuery} from "@tanstack/react-query";
import {fetchEventImages} from "@/lib/api/events/fetchEventImages";

export function useEventImages(eventId?: number) {
  return useQuery({
    queryKey: ["events", eventId, "images"],
    enabled: !!eventId,
    queryFn: async () => await fetchEventImages(eventId!),
    select: (data) => data.images,
    retry: 1,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  });
}