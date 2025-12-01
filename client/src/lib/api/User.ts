import apiFetch from "@/lib/apiFetch";
import User from "@/types/User";

interface AuthSuccess {
  user: User
}

async function fetchCSRF() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

export async function fetchAvailableProviders() {
  return await apiFetch<{ providers: Array<string> }>(`/auth/available-providers`, {
    method: "GET",
  });
}

export async function socialRedirect(socialMedia: string) {
  return await apiFetch<{ url: string }>(`/auth/${socialMedia}/redirect`, {
    method: "GET",
  });
}

export async function login(email: string, password: string, remember_me: boolean) {
  await fetchCSRF()

  return await apiFetch<AuthSuccess>("/auth/login", {
    method: "POST",
    body: JSON.stringify({email, password, remember_me}),
  });
}

export async function send_code(email: string) {
  return await apiFetch("/auth/send-code", {
    method: "POST",
    body: JSON.stringify({email}),
  });
}

export async function confirm_code(email: string, code: string) {
  return await apiFetch("/auth/confirm-code", {
    method: "POST",
    body: JSON.stringify({email, code}),
  });
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
  await fetchCSRF()

  return await apiFetch<AuthSuccess>("/auth/register", {
    method: "POST",
    body: JSON.stringify({name, email, password, password_confirmation}),
  });
}

export async function send_recovery_link(email: string) {
  return await apiFetch("/auth/send-recovery-link", {
    method: "POST",
    body: JSON.stringify({email}),
  });
}

export async function validate_recovery_token(email: string, token: string) {
  return await apiFetch("/auth/validate-recovery-token", {
    method: "POST",
    body: JSON.stringify({email, token}),
  });
}

export async function change_password(email: string, token: string, password: string, password_confirmation: string) {
  return await apiFetch("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({email, token, password, password_confirmation}),
  });
}
