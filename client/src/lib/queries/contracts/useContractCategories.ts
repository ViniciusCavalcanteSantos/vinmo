import {useQuery} from "@tanstack/react-query";
import {fetchContractCategories} from "@/lib/api/contracts/fetchContractCategories";

export default function useContractCategories(enabled = true) {
  return useQuery({
    queryKey: ['contract-categories'],
    queryFn: () => fetchContractCategories(),
    select: (data) => data.categories,
    staleTime: Infinity,
    retry: 1,
    enabled: enabled
  })
}