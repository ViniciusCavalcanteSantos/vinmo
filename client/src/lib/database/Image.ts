import apiFetch from "@/lib/apiFetch";
import {ImageMeta} from "@/types/Image";

export async function fetchImageMetadata(imageId: string) {
  return await apiFetch<{ metadata: ImageMeta }>(`/images/${imageId}/metadata`, {
    method: "GET",
  });
}