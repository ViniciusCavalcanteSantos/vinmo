import apiFetch from "@/lib/apiFetch";

export async function confirmCode(email: string, code: string) {
  return await apiFetch("/auth/confirm-code", {
    method: "POST",
    body: JSON.stringify({email, code}),
  });
}