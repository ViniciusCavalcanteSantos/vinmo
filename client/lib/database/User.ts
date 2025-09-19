import apiFetch from "@/lib/apiFetch";

interface AuthSuccess {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface AuthError {
    error: string;
}
export async function login(email: string, password: string) {
    const data = await apiFetch<AuthSuccess | AuthError>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if ("token" in data && typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
    }

    return data;
}

export async function register(name: string, email: string, password: string, password_confirmation: string) {
    const res = await apiFetch<AuthSuccess | AuthError>("/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password, password_confirmation }),
    });

    if ("token" in res && typeof window !== "undefined") {
        localStorage.setItem("token", res.token);
    }

    return res;
}

export async function getUser() {
    return apiFetch("/user");
}