import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateContract} from "@/lib/api/contracts/updateContract";

export function useUpdateContract() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, values}: { id: number, values: any }) => await updateContract(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["contracts"]});
    }
  });
}