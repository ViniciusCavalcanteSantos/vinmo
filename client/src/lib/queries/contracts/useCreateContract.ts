import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {ApiStatus} from "@/types/ApiResponse";
import {createContract, CreateContractResponse} from "@/lib/api/contracts/createContract";

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const res: ApiFetchResponse<CreateContractResponse> = await createContract(values);

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