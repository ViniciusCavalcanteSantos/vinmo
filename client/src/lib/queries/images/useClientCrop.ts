import {useQuery} from "@tanstack/react-query";
import {fetchClientCrop} from "@/lib/api/image/fetchClientCrop";
import {ApiStatus} from "@/types/ApiResponse";

export function useClientCrop(imageId?: string, clientId?: number, enabled: boolean = false) {
  return useQuery({
    queryKey: ["image", imageId, "client", clientId, "crop"],
    queryFn: async () => {
      const res = await fetchClientCrop(imageId!, clientId!);
      if (res.status !== ApiStatus.SUCCESS) {
        throw new Error(res.message);
      }
      return res.faceMatch.faceCrop;
    },
    enabled: !!imageId && !!clientId && enabled,
    retry: 1,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}