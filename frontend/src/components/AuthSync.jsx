"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthSync() {
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    // Sync essential Zustand state to a cookie so the middleware can read it
    // We only store token and role to keep the cookie small and avoid size limits
    const authState = {
      state: { token, role }
    };
    
    document.cookie = `auth-storage=${encodeURIComponent(JSON.stringify(authState))}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Also set a simple token cookie for easier access if needed
    if (token) {
      document.cookie = `auth-token=${token}; path=/; max-age=31536000; SameSite=Lax`;
    } else {
      document.cookie = "auth-token=; path=/; max-age=0; SameSite=Lax";
    }
  }, [token, role, user]);

  return null;
}
