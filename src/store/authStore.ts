import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, AccessToken } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: AccessToken | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: AccessToken) => void;
  clearAuth: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user: User, token: AccessToken) => {
        set({ user, token, isAuthenticated: true });
        localStorage.setItem("authUser", JSON.stringify(user));
        localStorage.setItem("authToken", JSON.stringify(token));
      },

      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("authUser");
        localStorage.removeItem("authToken");
      },

      initAuth: () => {
        const storedUser = localStorage.getItem("authUser");
        const storedToken = localStorage.getItem("authToken");

        if (storedUser && storedToken) {
          try {
            const user = JSON.parse(storedUser) as User;
            const token = JSON.parse(storedToken) as AccessToken;
            set({ user, token, isAuthenticated: true });
          } catch (error) {
            console.error("Failed to parse stored auth data:", error);
            set({ user: null, token: null, isAuthenticated: false });
          }
        }
      },
    }),
    {
      name: "auth-storage",
    }
  )
);
