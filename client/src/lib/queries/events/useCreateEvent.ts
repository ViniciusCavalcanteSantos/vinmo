import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {createEvent, CreateEventResponse} from "@/lib/api/events/createEvent";
import {ApiStatus} from "@/types/ApiResponse";

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (values) => {
      const res: ApiFetchResponse<CreateEventResponse> = await createEvent(values);

      if (res.status !== ApiStatus.SUCCESS) {
        throw new Error(res.message || "API error");
      }

      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["events"]});
    }
  });
}