import apiFetch from "@/lib/apiFetch";
import {fetchCSRF} from "@/lib/api/fetchCSRF";
import User from "@/types/User";

export async function login(email: string, password: string, remember_me: boolean) {
  await fetchCSRF()

  return await apiFetch<{ user: User }>("/auth/login", {
    method: "POST",
    body: JSON.stringify({email, password, remember_me}),
  });
}