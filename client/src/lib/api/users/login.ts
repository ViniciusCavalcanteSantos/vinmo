import apiFetch from "@/lib/apiFetch";

export async function login(email: string, password: string, remember_me: boolean) {
  await fetchCSRF()

  return await apiFetch<AuthSuccess>("/auth/login", {
    method: "POST",
    body: JSON.stringify({email, password, remember_me}),
  });
}