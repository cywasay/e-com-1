import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,

      setUser: (user, token) => {
        set({ user, token, role: user?.role || null });
      },

      logout: () => {
        set({ user: null, token: null, role: null });
        // Clear the auth cookie so middleware knows we're logged out
        if (typeof document !== 'undefined') {
          document.cookie = "auth-storage=; path=/; max-age=0; SameSite=Lax";
          document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;
