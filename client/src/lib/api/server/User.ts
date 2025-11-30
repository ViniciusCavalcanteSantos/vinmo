import {cookies} from "next/headers";
import ApiResponse, {ApiStatus} from "@/types/ApiResponse";
import User from "@/types/User";


export async function fetchUserServerSide() {
  const cookieStore = await cookies();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
    cache: 'no-store'
  });

  if (!res.ok) return {status: ApiStatus.ERROR, user: null};

  const data = await res.json();
  return data as ApiResponse & { user: User };
}