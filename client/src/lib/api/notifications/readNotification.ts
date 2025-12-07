import apiFetch from "@/lib/apiFetch";
import Notification from "@/types/Notification";

export async function readNotification(id: string) {
  return await apiFetch<{
    notifications: Notification[]
  }>(`/notifications/${id}/read`, {
    method: "POST"
  });
}
