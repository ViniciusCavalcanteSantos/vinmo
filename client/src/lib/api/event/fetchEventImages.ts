import apiFetch from "@/lib/apiFetch";
import Image from "@/types/Image";

export async function fetchEventImages(eventId: number) {
  return await apiFetch<{ images: Image[] }>(`/event/${eventId}/images`, {
    method: "GET",
  });
}
