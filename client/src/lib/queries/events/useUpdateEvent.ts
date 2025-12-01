import {useMutation, useQueryClient} from "@tanstack/react-query";
import {ApiFetchResponse} from "@/lib/apiFetch";
import {ApiStatus} from "@/types/ApiResponse";
import {updateEvent, UpdateEventResponse} from "@/lib/api/events/updateEvent";

export function useUpdateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({id, values}: { id: number, values: any }) => {
      const res: ApiFetchResponse<UpdateEventResponse> = await updateEvent(id, values);

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