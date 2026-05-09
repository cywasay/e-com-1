"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import RegisterHeader from "./_components/RegisterHeader";
import RegisterForm from "./_components/RegisterForm";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
  role: z.enum(["b2c_customer", "b2b_buyer"]),
  phone: z.string().optional(),
  company_name: z.string().optional(),
  tax_id: z.string().optional(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
}).refine((data) => data.role !== "b2b_buyer" || (!!data.company_name && !!data.tax_id), {
  message: "Company name and Tax ID are required for B2B accounts",
  path: ["company_name"],
});

export default function RegisterClient() {
  const router = useRouter();
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "b2c_customer" },
  });

  const selectedRole = watch("role");

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await api.post("/auth/register", data);
      router.push("/login");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <div className="min-h-[90vh] flex flex-col items-center justify-center bg-[#f8f7f4] px-4 py-12 font-sans text-[#1a1a2e]">
      <RegisterHeader />
      <div className="w-full max-w-xl bg-white rounded-lg shadow-sm border border-[#e8e4dc] overflow-hidden">
        <div className="p-8">
          <RegisterForm 
            register={register} errors={errors} isSubmitting={isSubmitting} 
            onSubmit={handleSubmit(onSubmit)} serverError={serverError} 
            selectedRole={selectedRole}
          />
        </div>
        <div className="px-8 py-5 bg-[#f8f7f4] border-t border-[#e8e4dc] text-center">
          <p className="text-sm text-[#6b6560]">Already have an account? <Link href="/login" className="font-semibold text-[#c8a96e]">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
