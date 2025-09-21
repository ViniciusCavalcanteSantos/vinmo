export default async function apiFetch<T = any>(path: string | URL | Request, options: RequestInit = {}): Promise<T>  {
    const token =
        typeof window !== "undefined"
            ? localStorage.getItem("token")
            : null;

    const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    console.log(process.env.NEXT_PUBLIC_API_URL);
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api${path}`, {
        ...options,
        headers,
        cache: options.cache ?? "no-store",
        credentials: 'omit'
    });

    return await res.json() as Promise<T>;
}