import apiFetch from "@/lib/apiFetch";

export async function changePassword(email: string, token: string, password: string, password_confirmation: string) {
  return await apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({email, token, password, password_confirmation}),
  });
}
