"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children }) {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !token) {
      router.replace("/login");
    }
  }, [token, router, mounted]);

  // Avoid hydration mismatch by returning null during SSR and initial client pass
  if (!mounted || !token) {
    return null;
  }

  return <>{children}</>;
}
