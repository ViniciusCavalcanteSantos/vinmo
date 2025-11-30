import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removeEvent} from "@/lib/api/event/removeEvent";

export function useRemoveEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => removeEvent(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({queryKey: ["events"]});
    },
  });
}
