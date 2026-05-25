"use client";

import { useState } from "react";
import Link from "next/link";
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
});

export default function ForgotPasswordClient() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      await api.post("/auth/forgot-password", data);
      setSubmitted(true);
    } catch (error) {
      setServerError(error.response?.data?.message || "Unable to send reset link.");
    }
  };

  return (
    <StorefrontLayout>
      <div className="mx-auto flex min-h-[60vh] max-w-md flex-col justify-center px-6 py-16">
        <Card>
          <CardContent className="space-y-6 p-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Forgot password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {submitted ? (
              <Alert>
                <AlertDescription>
                  If an account exists for that email, a reset link has been sent. Check your inbox.
                </AlertDescription>
              </Alert>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                  <Alert variant="destructive">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" {...register("email")} />
                  {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
                </div>
                <Button type="submit" variant="accent" size="cta" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Sending...</> : "Send reset link"}
                </Button>
              </form>
            )}

            <Link href="/login" className="block text-center text-sm font-medium text-accent hover:underline">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </StorefrontLayout>
  );
}
