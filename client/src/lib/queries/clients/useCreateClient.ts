import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {createClient, CreateClientResponse} from "@/lib/api/clients/createClient";
import {ApiStatus} from "@/types/ApiResponse";
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
      }) => {
      const res: ApiFetchResponse<CreateClientResponse> = await createClient(values, profile, onProgress);

      if (res.status !== ApiStatus.SUCCESS) {
        throw new Error(res.message || "API error");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["clients"]});
    }
  });
}