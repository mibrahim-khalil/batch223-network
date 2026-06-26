const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5000";

export type ApiErrorShape = { message?: string };

export async function api<T>(
  path: string,
  options?: RequestInit & { auth?: boolean }
): Promise<T> {
  const auth = options?.auth ?? false;

  const headers = new Headers(options?.headers);

  const isFormData =
    typeof FormData !== "undefined" && options?.body instanceof FormData;

  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = localStorage.getItem("batch223_access_token");
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg =
      (data as ApiErrorShape)?.message ||
      `Request failed: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  return data as T;
}