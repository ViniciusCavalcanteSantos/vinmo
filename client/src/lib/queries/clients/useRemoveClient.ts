import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removeClient} from "@/lib/api/clients/removeClient";

export function useRemoveClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeClient(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: ["clients"]});
    },
  });
}
