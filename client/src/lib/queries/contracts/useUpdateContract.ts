import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {ApiStatus} from "@/types/ApiResponse";
import {updateContract, UpdateContractResponse} from "@/lib/api/contracts/updateContract";

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, values}: { id: number, values: any }) => {
      const res: ApiFetchResponse<UpdateContractResponse> = await updateContract(id, values);

      if (res.status !== ApiStatus.SUCCESS) {
        throw new Error(res.message || "API error");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contracts"]});
    }
  });
}