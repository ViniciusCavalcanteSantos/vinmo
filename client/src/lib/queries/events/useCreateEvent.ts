import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createEvent} from "@/lib/api/events/createEvent";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => await createEvent(values),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["events"]});
    }
  });
}