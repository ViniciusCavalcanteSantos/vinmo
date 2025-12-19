import User from "@/types/User";
import {cache} from "react";
import apiFetch from "@/lib/apiFetch";

export const fetchUserServer = cache(async () => {
  return await apiFetch<{ user: User }>("/me", {
    method: "GET",
    throwOnError: false
  });
});