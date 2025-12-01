import apiFetch from "@/lib/apiFetch";

export async function socialRedirect(socialMedia: string) {
  return await apiFetch<{ url: string }>(`/auth/${socialMedia}/redirect`, {
    method: "GET",
  });
}