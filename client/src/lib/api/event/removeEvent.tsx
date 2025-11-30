import apiFetch from "@/lib/apiFetch";

export async function removeEvent(id: number) {
  return apiFetch(`/event/${id}`, {
    method: "DELETE",
  });
}
