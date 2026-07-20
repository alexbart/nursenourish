import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DefaultAddress {
  id: string;
  label?: string;
  county?: string;
  city?: string;
  addressLine?: string;
}

interface AuthStore {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  defaultAddress: DefaultAddress | null;
  login: (user: User, accessToken: string, refreshToken: string, defaultAddress: DefaultAddress | null) => void;
  logout: () => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setDefaultAddress: (address: DefaultAddress | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      defaultAddress: null,
      login: (user, accessToken, refreshToken, defaultAddress) => set({ user, accessToken, refreshToken, defaultAddress }),
      logout: () => set({ user: null, accessToken: null, refreshToken: null, defaultAddress: null }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setDefaultAddress: (defaultAddress) => set({ defaultAddress }),
    }),
    {
      name: "auth-storage",
    }
  )
);