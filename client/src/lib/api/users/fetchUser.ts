import apiFetch from "@/lib/apiFetch";
import User from "@/types/User";

export async function fetchUser(): Promise<User | null> {
  const data = await apiFetch<{ user: User | null }>('/me', {
    method: 'GET',
  });

  return data.user ?? null;
}