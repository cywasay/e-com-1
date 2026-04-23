import { create } from "zustand";

const useAuthStore = create((set) => ({
  user: null,
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,

  setUser: (user, token) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
    set({ user, token });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
