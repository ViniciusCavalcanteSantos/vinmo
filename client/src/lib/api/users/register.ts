import apiFetch from "@/lib/apiFetch";
import {fetchCSRF} from "@/lib/api/fetchCSRF";
import User from "@/types/User";

interface AuthSuccess {
  user: User
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
  await fetchCSRF()

  return await apiFetch<AuthSuccess>("/auth/register", {
    method: "POST",
    body: JSON.stringify({name, email, password, password_confirmation}),
  });
}