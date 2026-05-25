"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/lib/api";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

function ResetPasswordInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token") || "";
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: searchParams.get("email") || "",
    },
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await api.post("/auth/reset-password", { ...data, token });
      router.push("/login");
    } catch (error) {
      setServerError(error.response?.data?.message || error.response?.data?.errors?.email?.[0] || "Unable to reset password.");
    }
  };

  if (!token) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-md px-6 py-16 text-center">
          <p className="text-muted-foreground">Invalid or missing reset token.</p>
          <Link href="/forgot-password" className="mt-4 inline-block text-accent hover:underline">Request a new link</Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-16">
        <Card>
          <CardContent className="space-y-6 p-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reset password</h1>
              <p className="mt-2 text-sm text-muted-foreground">Choose a new password for your account.</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {serverError && (
                <Alert variant="destructive">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">New password</Label>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password_confirmation">Confirm password</Label>
                <Input id="password_confirmation" type="password" {...register("password_confirmation")} />
                {errors.password_confirmation && <p className="text-xs text-destructive">{errors.password_confirmation.message}</p>}
              </div>
              <Button type="submit" variant="accent" size="cta" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Reset password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </StorefrontLayout>
  );
}

export default function ResetPasswordClient() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordInner />
    </Suspense>
  );
}
