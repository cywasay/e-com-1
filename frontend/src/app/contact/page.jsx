"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { Phone, Mail, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const quoteSchema = z.object({
  name: z.string().min(1, "Full Name is required"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  company_name: z.string().optional(),
  product_interest: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quoteSchema),
  });

  const mutation = useMutation({
    mutationFn: (data) => api.post("/quotes", data),
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar />
      
      {/* Hero Section */}
      <div className="bg-[#1a1a2e] py-16 md:py-24 border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">Contact Sales</h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Have a question or need a custom quote? Our team is ready to help you find the perfect uniform solutions for your organization.
          </p>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
          {/* Left: Contact Info */}
          <div className="space-y-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-8 text-[#1a1a2e]">Get In Touch</h2>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a96e]/10 text-[#c8a96e] rounded-lg flex items-center justify-center shrink-0">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e] mb-1">Phone Support</p>
                    <p className="text-sm text-[#6b6560]">+971 4 123 4567</p>
                    <p className="text-sm text-[#6b6560]">+971 50 987 6543 (WhatsApp)</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a96e]/10 text-[#c8a96e] rounded-lg flex items-center justify-center shrink-0">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e] mb-1">Email Sales</p>
                    <p className="text-sm text-[#6b6560]">sales@uniforms.ae</p>
                    <p className="text-sm text-[#6b6560]">support@uniforms.ae</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-10 h-10 bg-[#c8a96e]/10 text-[#c8a96e] rounded-lg flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1a1a2e] mb-1">Corporate Office</p>
                    <p className="text-sm text-[#6b6560]">Showroom 12, Al Quoz Industrial Area 3</p>
                    <p className="text-sm text-[#6b6560]">Dubai, United Arab Emirates</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-lg border border-[#e8e4dc] shadow-sm">
              <h3 className="font-semibold text-[#1a1a2e] mb-4">Business Hours</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-[#e8e4dc] pb-2">
                  <span className="text-[#6b6560]">Monday - Friday</span>
                  <span className="font-medium text-[#1a1a2e]">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between border-b border-[#e8e4dc] pb-2">
                  <span className="text-[#6b6560]">Saturday</span>
                  <span className="font-medium text-[#1a1a2e]">10:00 AM - 4:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#6b6560]">Sunday</span>
                  <span className="font-medium text-red-600">Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Quote Form */}
          <div className="bg-white p-8 md:p-10 rounded-xl border border-[#e8e4dc] shadow-sm">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 bg-[#2d7a4f]/10 text-[#2d7a4f] rounded-full flex items-center justify-center mb-6">
                  <CheckCircle size={32} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e] mb-2">Request Received</h2>
                <p className="text-[#6b6560] text-sm max-w-sm mb-8">
                  Thank you for reaching out. Our sales team will review your requirements and get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="text-sm font-semibold text-[#c8a96e] hover:text-[#b89b60] transition-colors"
                >
                  Submit another request
                </button>
              </div>
            ) : (
              <>
                <div className="mb-8">
                  <h2 className="text-xl font-bold tracking-tight text-[#1a1a2e] mb-1">Request a Quote</h2>
                  <p className="text-sm text-[#6b6560]">Fill out the form below and we'll provide a custom proposal.</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#1a1a2e]">Full Name <span className="text-[#c8a96e]">*</span></label>
                      <input 
                        {...register("name")}
                        className="w-full bg-[#f8f7f4] border border-[#e8e4dc] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors"
                        placeholder="Jane Doe"
                      />
                      {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#1a1a2e]">Email Address <span className="text-[#c8a96e]">*</span></label>
                      <input 
                        {...register("email")}
                        className="w-full bg-[#f8f7f4] border border-[#e8e4dc] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors"
                        placeholder="jane@company.com"
                      />
                      {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#1a1a2e]">Phone Number <span className="text-[#c8a96e]">*</span></label>
                      <input 
                        {...register("phone")}
                        className="w-full bg-[#f8f7f4] border border-[#e8e4dc] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors"
                        placeholder="+971 50 123 4567"
                      />
                      {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-[#1a1a2e]">Company Name</label>
                      <input 
                        {...register("company_name")}
                        className="w-full bg-[#f8f7f4] border border-[#e8e4dc] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors"
                        placeholder="Company LLC"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1a1a2e]">Product Interest</label>
                    <input 
                      {...register("product_interest")}
                      className="w-full bg-[#f8f7f4] border border-[#e8e4dc] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors"
                      placeholder="e.g. Healthcare Uniforms, approx 500 units"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[#1a1a2e]">Message <span className="text-[#c8a96e]">*</span></label>
                    <textarea 
                      {...register("message")}
                      rows={5}
                      className="w-full bg-[#f8f7f4] border border-[#e8e4dc] rounded-md px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#c8a96e] focus:border-[#c8a96e] transition-colors resize-none"
                      placeholder="Tell us about your specific requirements..."
                    />
                    {errors.message && <p className="text-xs text-red-500">{errors.message.message}</p>}
                  </div>

                  <button 
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-[#c8a96e] text-[#1a1a2e] py-3 rounded-md font-semibold text-sm hover:bg-[#b89b60] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mt-2 uppercase tracking-widest"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Sending Request...
                      </>
                    ) : "Submit Request"}
                  </button>

                  {mutation.isError && (
                    <div className="p-3 bg-red-50 text-red-600 text-sm border border-red-100 rounded-md mt-4 text-center">
                      Failed to send request. Please try again later.
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

