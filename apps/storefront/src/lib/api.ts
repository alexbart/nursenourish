import axios from "axios";
import { useAuthStore } from "@/features/auth/store/auth.store";

function resolveApiBaseUrl(): string {
  const raw = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
  if (!raw) return "/api/v1";

  const withoutTrailingSlash = raw.replace(/\/+$/, "");
  if (withoutTrailingSlash.endsWith("/api/v1")) {
    return withoutTrailingSlash;
  }
  return `${withoutTrailingSlash}/api/v1`;
}

export const api = axios.create({
  // Local: vite proxies /api → backend. Production: set VITE_API_URL to the API deploy URL
  // (with or without /api/v1 — both work).
  baseURL: resolveApiBaseUrl(),
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
