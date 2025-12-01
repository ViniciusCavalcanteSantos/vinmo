import apiFetch from "@/lib/apiFetch";

export async function sendCode(email: string) {
  return await apiFetch("/auth/send-code", {
    method: "POST",
    body: JSON.stringify({email}),
  });
}
