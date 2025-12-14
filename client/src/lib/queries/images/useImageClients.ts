import {useQuery} from "@tanstack/react-query";
import {fetchImageClients} from "@/lib/api/images/fetchImageClients";

export function useImageClients(imageId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["image", imageId, "clients"],
    queryFn: async () => await fetchImageClients(imageId!),
    select: (data) => data.clients,
    enabled: !!imageId && enabled,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}