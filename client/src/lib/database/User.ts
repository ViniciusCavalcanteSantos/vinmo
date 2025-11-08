import apiFetch from "@/lib/apiFetch";
import {FullAddressType} from "@/types/Address";
import User from "@/types/User";

interface AuthSuccess {
  user: User
}

async function fetchCSRF() {
  return fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

export async function login(email: string, password: string, remember_me: boolean) {
  await fetchCSRF()

  return await apiFetch<AuthSuccess>("/login", {
    method: "POST",
    body: JSON.stringify({email, password, remember_me}),
  });
}

export async function send_code(email: string) {
  return await apiFetch("/send_code", {
    method: "POST",
    body: JSON.stringify({email}),
  });
}

export async function confirm_code(email: string, code: string) {
  return await apiFetch("/confirm_code", {
    method: "POST",
    body: JSON.stringify({email, code}),
  });
}

export async function register(name: string, email: string, password: string, password_confirmation: string, address: FullAddressType) {
  await fetchCSRF()

  return await apiFetch<AuthSuccess>("/register", {
    method: "POST",
    body: JSON.stringify({name, email, password, password_confirmation, address: address}),
  });
}

export async function send_recovery_link(email: string) {
  return await apiFetch("/send_recovery_link", {
    method: "POST",
    body: JSON.stringify({email}),
  });
}

export async function validate_recovery_token(email: string, token: string) {
  return await apiFetch("/validate_recovery_token", {
    method: "POST",
    body: JSON.stringify({email, token}),
  });
}

export async function change_password(email: string, token: string, password: string, password_confirmation: string) {
  return await apiFetch("/change_password", {
    method: "POST",
    body: JSON.stringify({email, token, password, password_confirmation}),
  });
}

export async function fetchUser() {
  return apiFetch<{ user: User }>("/me");
}