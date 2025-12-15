import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateClient} from "@/lib/api/clients/updateClient";
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
    ) => await updateClient(id, values, profile),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["clients"]});
    }
  });
}