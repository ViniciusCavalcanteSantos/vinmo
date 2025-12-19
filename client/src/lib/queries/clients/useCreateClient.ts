import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createClient} from "@/lib/api/clients/createClient";
import {UploadFile} from "antd";

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      {
        values,
        profile,
        onProgress
      }:
      {
        values: any,
        profile: UploadFile | File | Blob
        onProgress?: (progress: number) => void
      }) => await createClient(values, profile, onProgress),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["clients"]});
    }
  });
}