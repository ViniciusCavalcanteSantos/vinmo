import apiFetch from "@/lib/apiFetch";

export async function sendRecoveryLink(email: string) {
  return await apiFetch("/auth/send-recovery-link", {
    method: "POST",
    body: JSON.stringify({email}),
  });
}