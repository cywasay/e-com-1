"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";

export default function ProtectedRoute({ children, adminOnly = false, allowedRoles = null }) {
  const { token, role } = useAuthStore();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  const hasAllowedRole =
    !allowedRoles || (role && allowedRoles.includes(role));

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      if (!token) {
        router.replace("/login");
      } else if (adminOnly && !["super_admin", "admin_staff"].includes(role)) {
        router.replace("/");
      } else if (allowedRoles && role && !allowedRoles.includes(role)) {
        router.replace("/");
      }
    }
  }, [token, role, router, isHydrated, adminOnly, allowedRoles]);

  if (!isHydrated || !token) return null;
  if (adminOnly && !["super_admin", "admin_staff"].includes(role)) return null;
  if (allowedRoles && role && !hasAllowedRole) return null;

  return <>{children}</>;
}
