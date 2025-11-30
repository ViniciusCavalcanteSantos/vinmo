import apiFetch from "@/lib/apiFetch";

export async function removeImage(imageId: string) {
  return await apiFetch(`/images/${imageId}`, {
    method: "DELETE",
  });
}
