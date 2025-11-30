import {useQuery} from "@tanstack/react-query";
import {fetchImageMetadata} from "@/lib/api/image/fetchImageMetadata";
import {ApiStatus} from "@/types/ApiResponse";

export function useImageMetadata(imageId?: string, enabled = true) {
  return useQuery({
    queryKey: ["image", imageId, "metadata"],
    queryFn: async () => {
      const res = await fetchImageMetadata(imageId!);
      if (res.status !== ApiStatus.SUCCESS) throw new Error(res.message);
      return res.metadata;
    },
    enabled: !!imageId && enabled,
    retry: 2,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}