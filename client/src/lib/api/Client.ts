import apiFetch from "@/lib/apiFetch";
import Client from "@/types/Client";
import {UploadFile} from "antd";
import {objectToFormData} from "@/lib/objectToFormData";
import {RegisterLinkType} from "@/types/RegisterLinkType";

export interface CreateClientResponse {
  client: Client
}

export async function createClientPublic(
  linkId: string,
  values: any,
  profile: UploadFile | File | Blob,
  onProgress?: (progress: number) => void
) {
  const formData = objectToFormData(values, {'profile': profile})

  return apiFetch<CreateClientResponse>(`/public/client/register/${linkId}`, {
    method: "POST",
    body: formData,
    driver: 'axios',
    onProgress
  });
}

export async function generateRegisterLink(
  values: any,
) {

  return apiFetch<{ link_id: string }>("/client/generate-register-link", {
    method: "POST",
    body: JSON.stringify(values)
  });
}

export async function fetchLinkInfo(linkId: string) {
  return apiFetch<{ linkInfo: RegisterLinkType }>(`/client/get-link-info/${linkId}`, {
    method: "GET"
  });
}