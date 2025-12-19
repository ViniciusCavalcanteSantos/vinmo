import {useQuery} from "@tanstack/react-query";
import {fetchImageMetadata} from "@/lib/api/images/fetchImageMetadata";

export function useImageMetadata(imageId?: string, enabled = true) {
  return useQuery({
    queryKey: ["image", imageId, "metadata"],
    queryFn: async () => await fetchImageMetadata(imageId!),
    select: data => data.metadata,
    enabled: !!imageId && enabled,
    retry: 2,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}