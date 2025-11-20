import apiFetch from "@/lib/apiFetch";
import {ImageMeta} from "@/types/Image";
import downloadFile from "@/lib/download";
import Client from "@/types/Client";
import {FaceCropMatch} from "@/types/FaceCrop";

export async function fetchImageMetadata(imageId: string) {
  return await apiFetch<{ metadata: ImageMeta }>(`/images/${imageId}/metadata`, {
    method: "GET",
  });
}

export async function fetchImageClients(imageId: string) {
  return await apiFetch<{ clients: Client[] }>(`/images/${imageId}/clients`, {
    method: "GET",
  });
}

export async function fetchClientCrop(imageId: string, clientId: number) {
  return await apiFetch<{ faceMatch: FaceCropMatch }>(`/images/${imageId}/clients/crop/${clientId}`, {
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
