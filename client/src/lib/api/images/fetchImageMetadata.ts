import {ImageMeta} from "@/types/Image";
import apiFetch from "@/lib/apiFetch";

export async function fetchImageMetadata(imageId: string) {
  return await apiFetch<{ metadata: ImageMeta }>(`/images/${imageId}/metadata`, {
    method: "GET",
  });
}