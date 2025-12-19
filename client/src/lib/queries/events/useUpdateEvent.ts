import {useMutation, useQueryClient} from "@tanstack/react-query";
import {updateEvent} from "@/lib/api/events/updateEvent";

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, values}: { id: number, values: any }) => await updateEvent(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["events"]});
    }
  });
}