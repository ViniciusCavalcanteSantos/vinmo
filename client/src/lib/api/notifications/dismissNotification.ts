import apiFetch from "@/lib/apiFetch";
import Notification from "@/types/Notification";

export async function dismissNotification(id: string) {
  return await apiFetch<{
    notifications: Notification[]
  }>(`/notifications/${id}/dismiss`, {
    method: "DELETE"
  });
}
