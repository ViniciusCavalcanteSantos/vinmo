import {UploadFile} from "antd";
import {objectToFormData} from "@/lib/objectToFormData";
import apiFetch from "@/lib/apiFetch";
import Client from "@/types/Client";

export interface CreateClientResponse {
  client: Client
}

export async function createClient(
  values: any,
  profile: UploadFile | File | Blob,
  onProgress?: (progress: number) => void
) {
  const formData = objectToFormData(values, {'profile': profile})

  return apiFetch<CreateClientResponse>("/client", {
    method: "POST",
    body: formData,
    driver: 'axios',
    onProgress
  });
}
