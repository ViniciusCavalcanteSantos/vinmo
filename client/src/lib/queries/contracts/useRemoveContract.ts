import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removeContract} from "@/lib/api/contract/removeContract";

export function useRemoveContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeContract(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: ["contracts"]});
    },
  });
}
