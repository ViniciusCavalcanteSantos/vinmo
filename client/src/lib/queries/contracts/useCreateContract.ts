import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createContract} from "@/lib/api/contracts/createContract";

export function useCreateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => await createContract(values),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contracts"]});
    }
  });
}