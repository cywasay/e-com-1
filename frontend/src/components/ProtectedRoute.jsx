"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { token, role } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!token) {
        router.replace("/login");
      } else if (adminOnly && !["super_admin", "admin_staff"].includes(role)) {
        router.replace("/");
      }
    }
  }, [token, role, router, isHydrated, adminOnly]);

  if (!isHydrated || !token) return null;
  if (adminOnly && !["super_admin", "admin_staff"].includes(role)) return null;

  return <>{children}</>;
}
