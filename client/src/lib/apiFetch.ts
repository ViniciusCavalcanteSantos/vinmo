import ApiResponse, {ApiStatus} from "@/types/ApiResponse";
import {redirect} from "next/navigation";
import i18next from "@/i18n/i18next";

export type ApiFetchResponse<T = undefined> = ApiResponse & (T extends undefined ? {} : T);

export default async function apiFetch<T = undefined>(path: string | URL | Request, options: RequestInit = {}): Promise<ApiFetchResponse<T>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const lang = i18next.language;
  const isFormData = options.body instanceof FormData;
  const headers = {
    ...(isFormData ? {} : {"Content-Type": "application/json"}),
    "Accept": "application/json",
    "Accept-Language": lang,
    ...(options.headers || {}),
    ...(token ? {Authorization: `Bearer ${token}`} : {})
  };

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${path}`, {
    ...options,
    headers,
    cache: options.cache ?? "no-store",
    credentials: 'omit'
  });

  let data: any;
  try {
    data = await res.json()
  } catch (error) {
    data = null;
  }

  // se a API não retornou status/message, normaliza
  if (!data || !("status" in data) || !("message" in data)) {
    return {
      status: ApiStatus.ERROR,
      message: `Erro inesperado da API (HTTP ${res.status})`,
    } as ApiFetchResponse<T>;
  }

  if (data.status === ApiStatus.NOT_AUTHENTICATED) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    } else {
      redirect("/");
    }
  }

  return data;
}