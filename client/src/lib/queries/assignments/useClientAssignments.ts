import {useQuery} from "@tanstack/react-query";
import {fetchAssignments} from "@/lib/api/assignments/fetchAssignments";

export function useClientAssignments(clientId: number | undefined, enabled: boolean) {
  return useQuery({
    queryKey: ['client-assignments', clientId],
    queryFn: () => fetchAssignments(clientId!),
    enabled: !!clientId && enabled,
    staleTime: 1000 * 60 * 5,
  });
}