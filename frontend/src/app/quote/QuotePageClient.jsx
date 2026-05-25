"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle, Loader2, Minus, Plus, Trash2 } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import useQuoteStore from "@/store/quoteStore";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useState } from "react";

const quoteSchema = z.object({
  name: z.string().min(1, "Full name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  company_name: z.string().optional(),
  message: z.string().optional(),
});

export default function QuotePageClient() {
  const { user } = useAuthStore();
  const items = useQuoteStore((state) => state.items);
  const updateQuantity = useQuoteStore((state) => state.updateQuantity);
  const removeItem = useQuoteStore((state) => state.removeItem);
  const clearAll = useQuoteStore((state) => state.clearAll);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company_name: user?.company_name || "",
      message: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post("/quotes", data),
    onSuccess: () => {
      setSubmitted(true);
      clearAll();
    },
  });

  const onSubmit = (data) => {
    if (items.length === 0) return;

    mutation.mutate({
      ...data,
      product_interest: items.map((item) => item.name).join(", "),
      items: items.map((item) => ({
        product_id: item.product_id,
        variant_id: item.variant_id,
        variant_label: item.variant_label,
        quantity: item.quantity,
      })),
      message: data.message || "Quote request submitted from quote builder.",
    });
  };

  return (
    <StorefrontLayout>
      <div className="border-b border-border bg-white py-10">
        <div className="mx-auto max-w-4xl px-6">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Request a quote</h1>
          <p className="mt-2 text-muted-foreground">
            Review your selected products and submit your requirements to our sales team.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-12 pb-32">
        {submitted ? (
          <Card>
            <CardContent className="flex flex-col items-center py-16 text-center">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d7a4f]/10 text-[#2d7a4f]">
                <CheckCircle size={32} />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Quote submitted</h2>
              <p className="mb-8 max-w-md text-sm text-muted-foreground">
                Our team will review your request and respond within one business day.
              </p>
              <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }))}>
                Continue browsing
              </Link>
            </CardContent>
          </Card>
        ) : items.length === 0 ? (
          <Card>
            <CardContent className="py-16 text-center">
              <p className="text-muted-foreground">Your quote is empty.</p>
              <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }), "mt-6 inline-flex")}>
                Browse products
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            <Card>
              <CardContent className="divide-y divide-border p-0">
                {items.map((item) => (
                  <div
                    key={`${item.product_id}-${item.variant_id || "base"}`}
                    className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt="" className="h-16 w-16 rounded border border-border bg-muted object-contain p-1" />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded border border-border bg-muted text-xs text-muted-foreground">
                          N/A
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-foreground">{item.name}</p>
                        {item.variant_label && (
                          <p className="text-xs text-muted-foreground">{item.variant_label}</p>
                        )}
                        {item.moq > 1 && (
                          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            MOQ {item.moq}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-md border border-border">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.variant_id,
                              item.quantity - 1
                            )
                          }
                        >
                          <Minus size={14} />
                        </Button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() =>
                            updateQuantity(
                              item.product_id,
                              item.variant_id,
                              item.quantity + 1
                            )
                          }
                        >
                          <Plus size={14} />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-8">
                <h2 className="mb-6 text-lg font-bold">Your details</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Full name" required {...register("name")} error={errors.name} />
                    <Field label="Email" required {...register("email")} error={errors.email} />
                  </div>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Phone" required {...register("phone")} error={errors.phone} />
                    <Field label="Company" {...register("company_name")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Additional notes</Label>
                    <Textarea id="message" {...register("message")} rows={4} placeholder="Sizing, branding, delivery timeline..." />
                  </div>
                  <Button type="submit" variant="accent" size="cta" disabled={mutation.isPending} className="w-full">
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Submitting...
                      </>
                    ) : (
                      "Submit quote request"
                    )}
                  </Button>
                  {mutation.isError && (
                    <Alert variant="destructive">
                      <AlertDescription>Failed to submit quote. Please try again.</AlertDescription>
                    </Alert>
                  )}
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}

function Field({ label, error, required, id, ...props }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>
        {label} {required && <span className="text-accent">*</span>}
      </Label>
      <Input id={fieldId} {...props} aria-invalid={!!error} />
      {error && <p className="text-xs text-destructive">{error.message}</p>}
    </div>
  );
}
