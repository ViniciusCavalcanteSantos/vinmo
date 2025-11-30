import {useQuery} from "@tanstack/react-query";
import {fetchImageClients} from "@/lib/api/image/fetchImageClients";
import {ApiStatus} from "@/types/ApiResponse";

export function useImageClients(imageId?: string, enabled: boolean = true) {
  return useQuery({
    queryKey: ["image", imageId, "clients"],
    queryFn: async () => {
      const res = await fetchImageClients(imageId!);
      if (res.status !== ApiStatus.SUCCESS) {
        throw new Error(res.message || "Erro ao buscar clientes");
      }

      return res.clients;
    },
    enabled: !!imageId && enabled,
    retry: 1,
    refetchOnWindowFocus: true,
  });
}