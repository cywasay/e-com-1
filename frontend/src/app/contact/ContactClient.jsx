"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Phone, Mail, MapPin, CheckCircle, Loader2 } from "lucide-react";
import StorefrontLayout from "@/components/StorefrontLayout";
import { resolvePublicSettings } from "@/lib/fetchPublicSettings";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const quoteSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  company_name: z.string().optional(),
  product_interest: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

function ContactPageInner({ settings }) {
  const store = resolvePublicSettings(settings);
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const [submitted, setSubmitted] = useState(false);
  const productPrefill = searchParams.get("product") || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      company_name: user?.company_name || "",
      product_interest: productPrefill,
      message: productPrefill ? `I'm interested in a quote for: ${productPrefill}` : "",
    },
  });

  useEffect(() => {
    if (productPrefill) {
      setValue("product_interest", productPrefill);
      setValue("message", `I'm interested in a quote for: ${productPrefill}`);
    }
  }, [productPrefill, setValue]);

  const mutation = useMutation({
    mutationFn: (data) => api.post("/quotes", data),
    onSuccess: () => {
      setSubmitted(true);
      reset({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        company_name: user?.company_name || "",
        product_interest: "",
        message: "",
      });
    },
  });

  const addressLines = String(store.store_address || "").split("\n").filter(Boolean);
  const contactItems = [
    {
      icon: Phone,
      title: "Phone Support",
      lines: [store.store_phone, store.store_whatsapp ? `${store.store_whatsapp} (WhatsApp)` : null].filter(Boolean),
    },
    {
      icon: Mail,
      title: "Email Sales",
      lines: [store.store_email],
    },
    {
      icon: MapPin,
      title: "Corporate Office",
      lines: addressLines.length ? addressLines : [store.store_address],
    },
  ];

  return (
    <StorefrontLayout>
      <div className="border-b border-[#ffffff]/10 bg-[#1a1a2e] py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">Contact Sales</h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Have a question or need a custom quote? Our team is ready to help you find the perfect uniform solutions for your organization.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl flex-1 px-6 py-16">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-12">
            <div>
              <h2 className="mb-8 text-2xl font-bold tracking-tight text-foreground">Get In Touch</h2>
              <div className="space-y-8">
                {contactItems.map(({ icon: Icon, title, lines }) => (
                  <div key={title} className="flex gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                      <Icon size={20} />
                    </div>
                    <div>
                      <p className="mb-1 text-sm font-semibold text-foreground">{title}</p>
                      {lines.map((line) => (
                        <p key={line} className="text-sm text-muted-foreground">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Business Hours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Monday - Friday</span>
                  <span className="font-medium text-foreground">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Saturday</span>
                  <span className="font-medium text-foreground">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sunday</span>
                  <span className="font-medium text-destructive">Closed</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="p-8 md:p-10">
              {submitted ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#2d7a4f]/10 text-[#2d7a4f]">
                    <CheckCircle size={32} />
                  </div>
                  <h2 className="mb-2 text-2xl font-bold tracking-tight text-foreground">Request Received</h2>
                  <p className="mb-8 max-w-sm text-sm text-muted-foreground">
                    Thank you for reaching out. Our sales team will review your requirements and get back to you within 24 hours.
                  </p>
                  <Button type="button" variant="link" onClick={() => setSubmitted(false)} className="text-accent">
                    Submit another request
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-8">
                    <h2 className="mb-1 text-xl font-bold tracking-tight text-foreground">Request a Quote</h2>
                    <p className="text-sm text-muted-foreground">Fill out the form below and we&apos;ll provide a custom proposal.</p>
                  </div>

                  <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="Full Name" required {...register("name")} error={errors.name} placeholder="Jane Doe" />
                      <Field label="Email Address" required {...register("email")} error={errors.email} placeholder="jane@company.com" />
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                      <Field label="Phone Number" required {...register("phone")} error={errors.phone} placeholder="+971 50 123 4567" />
                      <Field label="Company Name" {...register("company_name")} placeholder="Company LLC" />
                    </div>

                    <Field label="Product Interest" {...register("product_interest")} placeholder="e.g. Healthcare Uniforms, approx 500 units" />

                    <div className="space-y-2">
                      <Label htmlFor="message">
                        Message <span className="text-accent">*</span>
                      </Label>
                      <Textarea id="message" {...register("message")} rows={5} placeholder="Tell us about your specific requirements..." aria-invalid={!!errors.message} />
                      {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
                    </div>

                    <Button type="submit" variant="accent" size="cta" disabled={mutation.isPending} className="mt-2 w-full">
                      {mutation.isPending ? (
                        <>
                          <Loader2 className="animate-spin" size={16} />
                          Sending Request...
                        </>
                      ) : (
                        "Submit Request"
                      )}
                    </Button>

                    {mutation.isError && (
                      <Alert variant="destructive">
                        <AlertDescription>Failed to send request. Please try again later.</AlertDescription>
                      </Alert>
                    )}
                  </form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </StorefrontLayout>
  );
}

export default function ContactClient({ settings }) {
  return (
    <Suspense fallback={null}>
      <ContactPageInner settings={settings} />
    </Suspense>
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
