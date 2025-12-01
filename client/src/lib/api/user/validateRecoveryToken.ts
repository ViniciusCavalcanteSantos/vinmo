import apiFetch from "@/lib/apiFetch";

export async function validateRecoveryToken(email: string, token: string) {
  return await apiFetch("/auth/validate-recovery-token", {
    method: "POST",
    body: JSON.stringify({email, token}),
  });
}