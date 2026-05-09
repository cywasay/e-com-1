"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import LoginHeader from "./_components/LoginHeader";
import LoginForm from "./_components/LoginForm";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export default function LoginClient() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      const res = await api.post("/auth/login", data);
      const { user, token } = res.data.data;
      setUser(user, token);
      
      const authState = { state: { token, role: user.role } };
      document.cookie = `auth-storage=${encodeURIComponent(JSON.stringify(authState))}; path=/; max-age=31536000; SameSite=Lax`;
      document.cookie = `auth-token=${token}; path=/; max-age=31536000; SameSite=Lax`;

      router.push(['super_admin', 'admin_staff'].includes(user.role) ? "/admin" : "/");
    } catch (err) {
      setServerError(err.response?.data?.message || "Invalid credentials.");
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#f8f7f4] px-4 py-12 font-sans text-[#1a1a2e]">
      <LoginHeader />
      <div className="w-full max-w-md bg-white rounded-lg shadow-sm border border-[#e8e4dc] overflow-hidden">
        <div className="p-8">
          <LoginForm 
            register={register} errors={errors} isSubmitting={isSubmitting} 
            onSubmit={handleSubmit(onSubmit)} serverError={serverError} 
          />
        </div>
        <div className="px-8 py-5 bg-[#f8f7f4] border-t border-[#e8e4dc] text-center">
          <p className="text-sm text-[#6b6560]">Don't have an account? <Link href="/register" className="font-semibold text-[#c8a96e]">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
