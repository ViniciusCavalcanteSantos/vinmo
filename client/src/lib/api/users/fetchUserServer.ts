import {cookies} from "next/headers";
import ApiResponse from "@/types/ApiResponse";
import User from "@/types/User";
import {cache} from "react";

export const fetchUserServer = cache(async () => {
  try {
    const cookieStore = await cookies();
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/me`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
      cache: 'no-store'
    });

    if (!res.ok) return {user: null};

    const data = await res.json();
    return data as ApiResponse & { user: User };
  } catch (err) {
    return {user: null}
  }
})