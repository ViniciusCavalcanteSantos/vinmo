import apiFetch from "@/lib/apiFetch";
import {FaceCropMatch} from "@/types/FaceCrop";

export async function fetchClientCrop(imageId: string, clientId: number) {
  return await apiFetch<{ faceMatch: FaceCropMatch }>(`/images/${imageId}/clients/${clientId}/crop`, {
    method: "GET",
  });
}