import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {ApiStatus} from "@/types/ApiResponse";
import {updateClient, UpdateClientResponse} from "@/lib/api/client/updateClient";
import {UploadFile} from "antd";

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      {
        id,
        values,
        profile
      }:
      {
        id: number,
        values: any,
        profile: UploadFile
      }
    ) => {
      const res: ApiFetchResponse<UpdateClientResponse> = await updateClient(id, values, profile);

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