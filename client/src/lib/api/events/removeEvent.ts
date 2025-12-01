import apiFetch from "@/lib/apiFetch";

export async function removeEvent(id: number) {
  return apiFetch(`/events/${id}`, {
    method: "DELETE",
  });
}
