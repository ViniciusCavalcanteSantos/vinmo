import {useMutation, useQueryClient} from "@tanstack/react-query";
import {removeImage} from "@/lib/api/images/removeImage";

export function useRemoveImage(eventId?: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeImage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["event", eventId, "images"], exact: false});
    },
  });
}
