import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {CreateEventResponse} from "@/lib/api/event/createEvent";
import {ApiStatus} from "@/types/ApiResponse";
import {updateEvent} from "@/lib/api/event/updateEvent";

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, values}: { id: number, values: any }) => {
      const res: ApiFetchResponse<CreateEventResponse> = await updateEvent(id, values);

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