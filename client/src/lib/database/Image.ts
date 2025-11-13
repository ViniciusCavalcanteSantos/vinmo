import apiFetch from "@/lib/apiFetch";
import {ImageMeta} from "@/types/Image";
import downloadFile from "@/lib/download";

export async function fetchImageMetadata(imageId: string) {
  return await apiFetch<{ metadata: ImageMeta }>(`/images/${imageId}/metadata`, {
    method: "GET",
  });
}

export function downloadImage(imageId: string) {
  downloadFile(`${process.env.NEXT_PUBLIC_API_URL}/api/images/${imageId}/download`)
}

export async function removeImage(imageId: string) {
  return await apiFetch(`/images/${imageId}`, {
    method: "DELETE",
  });
}
