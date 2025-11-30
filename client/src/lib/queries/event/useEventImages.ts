import {useQuery} from "@tanstack/react-query";
import {fetchEventImages} from "@/lib/api/event/fetchEventImages";
import {ApiStatus} from "@/types/ApiResponse";

export function useFetchEventImages(eventId?: number) {
  return useQuery({
    queryKey: ["event", eventId, "images"],
    enabled: !!eventId,
    queryFn: async () => await fetchEventImages(eventId!),
    select: (res) =>
      res.status === ApiStatus.SUCCESS ? res.images : [],
  });
}