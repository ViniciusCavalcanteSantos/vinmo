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

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = document.cookie
    .split("; ")
    .find((row) => row.startsWith(name + "="))
    ?.split("=")[1];

  return value ? decodeURIComponent(value) : null;
}

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

  const method = (options.method || "GET").toUpperCase();
  const isMutatingMethod = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  // pega XSRF só no browser e só para métodos mutáveis
  let xsrfHeader: Record<string, string> = {};
  if (typeof window !== "undefined" && isMutatingMethod) {
    const xsrfCookie = getCookie("XSRF-TOKEN");
    if (xsrfCookie) {
      xsrfHeader["X-XSRF-TOKEN"] = decodeURIComponent(xsrfCookie);
    }
  }

  const headers = {
    ...(isFormData ? {} : {"Content-Type": "application/json"}),
    "Accept": "application/json",
    "Accept-Language": lang,
    ...(options.headers as Record<string, string> || {}),
    ...xsrfHeader
  };

  const handleNotAuthenticated = () => {
    if (typeof window !== "undefined") {
      document.cookie = 'logged_in=; Max-Age=0; Path=/; SameSite=Lax';
      window.location.href = "/signin";
    } else {
      redirect("/signin");
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
        withCredentials: true,
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
    credentials: 'include'
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