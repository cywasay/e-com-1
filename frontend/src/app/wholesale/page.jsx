"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import Navbar from "@/components/Navbar";
import { Loader2, CheckCircle2, AlertCircle, Building2, ChevronRight, MessageSquare } from "lucide-react";

export default function WholesalePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: (data) => api.post("/b2b/apply", data),
    onSuccess: () => {
      setSubmitted(true);
      // We should ideally refresh the user state here or the page
      window.location.reload(); 
    },
  });

  const onSubmit = (data) => mutation.mutate(data);

  // 1. Guest View
  if (!user) {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <section className="bg-[#1a1a2e] text-white py-24 px-6 text-center border-b border-[#ffffff]/10">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-6 uppercase">
              Uniforms<span className="text-[#c8a96e]">.ae</span> Wholesale
            </h1>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Unlock exclusive business pricing, bulk discounts, and dedicated account management. 
              Join the largest workwear network in the UAE.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/login" className="bg-[#c8a96e] text-[#1a1a2e] px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#b89b60] transition-all">
                Login to Apply
              </Link>
              <Link href="/register" className="border border-white/20 text-white px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-white/10 transition-all">
                Create Account
              </Link>
            </div>
          </div>
        </section>

        <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: "Tiered Pricing", desc: "The more you buy, the more you save with our volume-based price sets." },
            { title: "Net Terms", desc: "Approved business accounts gain access to flexible credit and payment terms." },
            { title: "Custom Branding", desc: "One-click ordering for your company's custom embroidered uniforms." }
          ].map((item, i) => (
            <div key={i} className="space-y-4">
              <div className="w-12 h-12 bg-[#c8a96e]/10 text-[#c8a96e] rounded-xl flex items-center justify-center font-black text-xl">0{i+1}</div>
              <h3 className="text-xl font-bold text-[#1a1a2e]">{item.title}</h3>
              <p className="text-[#6b6560] text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    );
  }

  // 2. Pending View
  if (user.b2b_status === "pending") {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
          <div className="w-20 h-20 bg-[#c8a96e]/10 text-[#c8a96e] rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
            <Loader2 size={40} className="animate-spin" />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4 uppercase text-[#1a1a2e]">Application Under Review</h2>
          <p className="text-[#6b6560] mb-8 text-lg">
            Thank you for applying for a wholesale account. Our team is currently reviewing your details. 
            You'll receive an email once your account has been upgraded.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 text-[#c8a96e] font-bold uppercase tracking-widest text-sm hover:gap-4 transition-all hover:text-[#1a1a2e]">
            Browse Public Catalog <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    );
  }

  // 3. Approved View
  if (user.b2b_status === "approved") {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
          <div className="w-20 h-20 bg-[#2d7a4f]/10 text-[#2d7a4f] rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4 uppercase text-[#2d7a4f]">Wholesale Access Active</h2>
          <p className="text-[#6b6560] mb-10 text-lg">
            Welcome back! You have full access to our B2B pricing and bulk ordering tools.
          </p>
          <Link href="/products" className="bg-[#c8a96e] text-[#1a1a2e] px-10 py-4 rounded-full font-bold uppercase tracking-widest hover:bg-[#b89b60] transition-all">
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  // 4. Rejected View
  if (user.b2b_status === "rejected") {
    return (
      <div className="min-h-screen bg-[#f8f7f4]">
        <Navbar />
        <div className="max-w-2xl mx-auto py-32 px-6 text-center">
          <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
            <AlertCircle size={40} />
          </div>
          <h2 className="text-3xl font-black tracking-tight mb-4 uppercase text-red-600">Application Rejected</h2>
          <p className="text-[#6b6560] mb-8 text-lg">
            We're sorry, but your wholesale application was not approved at this time. 
            Please contact our support team if you believe this was an error.
          </p>
          <Link href="mailto:wholesale@uniforms.ae" className="inline-flex items-center gap-3 bg-[#1a1a2e] text-[#c8a96e] px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#1a1a2e]/90 transition-all">
            <MessageSquare size={18} /> Contact Support
          </Link>
        </div>
      </div>
    );
  }

  // 5. Form View (b2b_status is 'none')
  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <Navbar />
      <div className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row border border-[#e8e4dc]">
          <div className="md:w-1/3 bg-[#1a1a2e] text-white p-12">
            <Building2 size={48} className="text-[#c8a96e] mb-8" />
            <h2 className="text-2xl font-black mb-4 uppercase leading-tight">Wholesale Application</h2>
            <p className="text-white/80 text-sm leading-relaxed">
              Fill out this form to request access to our B2B portal. Most applications are reviewed within 24-48 hours.
            </p>
          </div>
          
          <div className="md:w-2/3 p-12">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {mutation.isError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm flex gap-3 items-center">
                  <AlertCircle size={18} /> {mutation.error?.response?.data?.message || "Something went wrong"}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Company Name</label>
                  <input 
                    {...register("company_name", { required: true })}
                    className="w-full bg-[#f8f7f4] border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#c8a96e] transition-all outline-none"
                    placeholder="E.g. Uniforms UAE LLC"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Business Type</label>
                  <select 
                    {...register("business_type", { required: true })}
                    className="w-full bg-[#f8f7f4] border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#c8a96e] transition-all outline-none appearance-none"
                  >
                    <option value="">Select Type</option>
                    <option value="Retailer">Retailer</option>
                    <option value="Reseller">Reseller</option>
                    <option value="Corporate">Corporate</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Estimated Monthly Order Volume</label>
                <input 
                  {...register("est_order_volume", { required: true })}
                  className="w-full bg-[#f8f7f4] border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#c8a96e] transition-all outline-none"
                  placeholder="E.g. 100-500 units"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Tax ID / VAT Number (Optional)</label>
                <input 
                  {...register("tax_id")}
                  className="w-full bg-[#f8f7f4] border-none px-4 py-3 rounded-xl focus:ring-2 focus:ring-[#c8a96e] transition-all outline-none"
                  placeholder="E.g. TRN 100..."
                />
              </div>

              <button 
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#c8a96e] text-[#1a1a2e] py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-[#b89b60] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {mutation.isPending ? <Loader2 className="animate-spin" /> : "Submit Application"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
