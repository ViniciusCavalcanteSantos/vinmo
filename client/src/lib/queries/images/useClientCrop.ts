import {useQuery} from "@tanstack/react-query";
import {fetchClientCrop} from "@/lib/api/images/fetchClientCrop";

export function useClientCrop(imageId?: string, clientId?: number, enabled: boolean = false) {
  return useQuery({
    queryKey: ["image", imageId, "client", clientId, "crop"],
    queryFn: async () => await fetchClientCrop(imageId!, clientId!),
    select: (data) => data.faceMatch.faceCrop,
    enabled: !!imageId && !!clientId && enabled,
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}