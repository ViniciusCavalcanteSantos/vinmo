import {useQuery} from "@tanstack/react-query";
import {fetchNotifications} from "@/lib/api/notifications/fetchNotifications";

export default function useFetchNotification() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotifications(),
  })
}