import { create } from "zustand";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthStore {
  user: AdminUser | null;
  token: string | null;
  login: (user: AdminUser, token: string) => void;
  logout: () => void;
}

const stored = localStorage.getItem("admin_user");

export const useAuthStore = create<AuthStore>((set) => ({
  user: stored ? JSON.parse(stored) : null,
  token: localStorage.getItem("admin_token"),
  login: (user, token) => {
    localStorage.setItem("admin_token", token);
    localStorage.setItem("admin_user", JSON.stringify(user));
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    set({ user: null, token: null });
  },
}));
