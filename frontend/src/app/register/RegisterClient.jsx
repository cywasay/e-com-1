"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import StorefrontLayout from "@/components/StorefrontLayout";
import RegisterForm from "./_components/RegisterForm";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

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
    <StorefrontLayout>
      <div className="flex flex-col items-center justify-center px-4 py-16">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight mb-2">Create Account</h1>
          <p className="text-muted-foreground text-sm">Join uniforms.ae as a retail or corporate buyer</p>
        </div>
        <Card className="w-full max-w-xl overflow-hidden">
          <CardContent className="p-8">
            <RegisterForm
              register={register} errors={errors} isSubmitting={isSubmitting}
              onSubmit={handleSubmit(onSubmit)} serverError={serverError}
              selectedRole={selectedRole}
            />
          </CardContent>
          <CardFooter className="justify-center border-t bg-muted px-8 py-5">
            <p className="text-sm text-muted-foreground">Already have an account? <Link href="/login" className="font-semibold text-accent">Sign in</Link></p>
          </CardFooter>
        </Card>
      </div>
    </StorefrontLayout>
  );
}
