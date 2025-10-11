import ApiResponse, {ApiStatus} from "@/types/ApiResponse";
import {redirect} from "next/navigation";
import i18next from "@/i18n/i18next";
import axios from "axios";

export type ApiDriver = "fetch" | "axios";

export interface ApiFetchOptions extends RequestInit {
  driver?: ApiDriver;
  onProgress?: (progress: number) => void;
}

export type ApiFetchResponse<T = undefined> = ApiResponse &
  (T extends undefined ? {} : T);

export default async function apiFetch<T = undefined>(
  path: string | URL | Request,
  options: ApiFetchOptions = {}
): Promise<ApiFetchResponse<T>> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  const lang = i18next.language;
  const isFormData = options.body instanceof FormData;
  const driver = options.driver ?? "fetch";
  const headers = {
    ...(isFormData ? {} : {"Content-Type": "application/json"}),
    "Accept": "application/json",
    "Accept-Language": lang,
    ...(options.headers as Record<string, string> || {}),
    ...(token ? {Authorization: `Bearer ${token}`} : {})
  };

  const handleNotAuthenticated = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/";
    } else {
      redirect("/");
    }
  }

  const handleUnexpectedError = (code: string | number) => {
    return {
      status: ApiStatus.ERROR,
      message: `Erro inesperado da API (HTTP ${code})`,
    } as ApiFetchResponse<T>;
  }

  // ======================================
  // 🚀 DRIVER: AXIOS
  // ======================================
  if (driver === "axios") {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/api${path}`;
    try {
      const res = await axios({
        method: options.method || "POST",
        url,
        headers,
        data: options.body,
        onUploadProgress: (event) => {
          if (event.total && options.onProgress) {
            const percent = Math.round((event.loaded / event.total) * 100);
            options.onProgress(percent);
          }
        },
      });

      const data = res.data;
      if (data.status === ApiStatus.NOT_AUTHENTICATED) {
        handleNotAuthenticated()
      }

      return data;
    } catch (error: any) {
      const data = error.response.data
      if (!data || !("status" in data) || !("message" in data)) {
        return handleUnexpectedError(error.status)
      }

      return data;
    }
  }

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

  if (!data || !("status" in data) || !("message" in data)) {
    return handleUnexpectedError(res.status)
  }

  if (data.status === ApiStatus.NOT_AUTHENTICATED) {
    handleNotAuthenticated()
  }

  return data;
}