import apiFetch from "@/lib/apiFetch";
import Notification from "@/types/Notification";

export async function fetchNotifications() {
  return await apiFetch<{
    notifications: Notification[]
  }>(`/notifications`, {
    method: "GET"
  });
}
