import {UploadFile} from "antd";
import {objectToFormData} from "@/lib/objectToFormData";
import apiFetch from "@/lib/apiFetch";
import Image from "@/types/Image";

export async function uploadEventPhoto(
  eventId: number | string,
  photo: UploadFile | File | Blob,
  onProgress?: (progress: number) => void
) {
  const formData = objectToFormData({event_id: eventId}, {'photo': photo})

  return apiFetch<{ image: Image }>("/events/photos", {
    method: "POST",
    body: formData,
    driver: 'axios',
    onProgress
  });
}
