import {useMutation, useQueryClient} from "@tanstack/react-query";
import {uploadEventPhoto} from "@/lib/api/events/uploadEventPhoto";
import {UploadFile} from "antd";

export function useUploadEventPhoto() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (
      {
        eventId,
        photo,
        onProgress
      }:
      {
        eventId: number | string,
        photo: UploadFile | File | Blob,
        onProgress?: (progress: number) => void
      }) => uploadEventPhoto(eventId, photo, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["events"]})
    }
  })
}