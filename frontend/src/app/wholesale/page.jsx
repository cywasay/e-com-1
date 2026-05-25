"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Loader2, CheckCircle2, AlertCircle, Building2, ChevronRight, MessageSquare } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function WholesalePage() {
  const { user } = useAuthStore();
  const { register, handleSubmit, setValue, watch } = useForm();
  const businessType = watch("business_type");

  const mutation = useMutation({
    mutationFn: (data) => api.post("/b2b/apply", data),
    onSuccess: () => {
      window.location.reload();
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  if (!user) {
    return (
      <StorefrontLayout>
        <section className="border-b border-[#ffffff]/10 bg-[#1a1a2e] px-6 py-24 text-center text-white">
          <div className="mx-auto max-w-3xl">
            <h1 className="mb-6 text-4xl font-black uppercase tracking-tighter md:text-5xl">
              Uniforms<span className="text-accent">.ae</span> Wholesale
            </h1>
            <p className="mb-10 text-lg leading-relaxed text-white/80">
              Unlock exclusive business pricing, bulk discounts, and dedicated account management.
              Join the largest workwear network in the UAE.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link href="/login" className={cn(buttonVariants({ variant: "accent", size: "cta" }), "rounded-full px-10")}>
                Login to Apply
              </Link>
              <Link href="/register" className={cn(buttonVariants({ variant: "outline", size: "cta" }), "rounded-full border-white/20 px-10 text-white hover:bg-white/10")}>
                Create Account
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 py-24 md:grid-cols-3">
          {[
            { title: "Tiered Pricing", desc: "The more you buy, the more you save with our volume-based price sets." },
            { title: "Net Terms", desc: "Approved business accounts gain access to flexible credit and payment terms." },
            { title: "Custom Branding", desc: "One-click ordering for your company's custom embroidered uniforms." },
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-xl font-black text-accent">
                0{i + 1}
              </div>
              <h3 className="text-xl font-bold text-foreground">{item.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>
      </StorefrontLayout>
    );
  }

  if (user.b2b_status === "pending") {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-accent/10 text-accent">
            <Loader2 size={40} className="animate-spin" />
          </div>
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-foreground">Application Under Review</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            Thank you for applying for a wholesale account. Our team is currently reviewing your details.
            You&apos;ll receive an email once your account has been upgraded.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-accent hover:gap-4 hover:text-foreground">
            Browse Public Catalog <ChevronRight size={16} />
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  if (user.b2b_status === "approved") {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-[#2d7a4f]/10 text-[#2d7a4f]">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-[#2d7a4f]">Wholesale Access Active</h2>
          <p className="mb-10 text-lg text-muted-foreground">
            Welcome back! You have full access to our B2B pricing and bulk ordering tools.
          </p>
          <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }), "rounded-full px-10")}>
            Start Shopping
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  if (user.b2b_status === "rejected") {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-2xl px-6 py-32 text-center">
          <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-600">
            <AlertCircle size={40} />
          </div>
          <h2 className="mb-4 text-3xl font-black uppercase tracking-tight text-red-600">Application Rejected</h2>
          <p className="mb-8 text-lg text-muted-foreground">
            We&apos;re sorry, but your wholesale application was not approved at this time.
            Please contact our support team if you believe this was an error.
          </p>
          <Link href="mailto:wholesale@uniforms.ae" className={cn(buttonVariants({ variant: "default", size: "cta" }), "inline-flex gap-3 rounded-full")}>
            <MessageSquare size={18} /> Contact Support
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="mx-auto max-w-4xl px-6 py-20">
        <Card className="overflow-hidden py-0">
          <div className="flex flex-col md:flex-row">
            <div className="bg-[#1a1a2e] p-12 text-white md:w-1/3">
              <Building2 size={48} className="mb-8 text-accent" />
              <h2 className="mb-4 text-2xl leading-tight font-black uppercase">Wholesale Application</h2>
              <p className="text-sm leading-relaxed text-white/80">
                Fill out this form to request access to our B2B portal. Most applications are reviewed within 24-48 hours.
              </p>
            </div>

            <CardContent className="p-12 md:w-2/3">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {mutation.isError && (
                  <Alert variant="destructive">
                    <AlertCircle size={18} />
                    <AlertDescription>
                      {mutation.error?.response?.data?.message || "Something went wrong"}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Company Name</Label>
                    <Input {...register("company_name", { required: true })} className="h-11 rounded-xl bg-muted" placeholder="E.g. Uniforms UAE LLC" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Business Type</Label>
                    <Select value={businessType || ""} onValueChange={(value) => setValue("business_type", value, { shouldValidate: true })}>
                      <SelectTrigger className="h-11 w-full rounded-xl bg-muted">
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Retailer">Retailer</SelectItem>
                        <SelectItem value="Reseller">Reseller</SelectItem>
                        <SelectItem value="Corporate">Corporate</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <input type="hidden" {...register("business_type", { required: true })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Estimated Monthly Order Volume</Label>
                  <Input {...register("est_order_volume", { required: true })} className="h-11 rounded-xl bg-muted" placeholder="E.g. 100-500 units" />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tax ID / VAT Number (Optional)</Label>
                  <Input {...register("tax_id")} className="h-11 rounded-xl bg-muted" placeholder="E.g. TRN 100..." />
                </div>

                <Button type="submit" variant="accent" size="cta" disabled={mutation.isPending} className="h-12 w-full rounded-xl">
                  {mutation.isPending ? <Loader2 className="animate-spin" /> : "Submit Application"}
                </Button>
              </form>
            </CardContent>
          </div>
        </Card>
      </div>
    </StorefrontLayout>
  );
}
