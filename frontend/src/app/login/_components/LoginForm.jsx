"use client";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LoginForm({ register, errors, isSubmitting, onSubmit, serverError }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {serverError && (
        <div className="mb-6 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2">
          <span className="block mt-0.5">•</span>{serverError}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium mb-1">Email Address</label>
        <input {...register("email")} className="w-full rounded-md border border-[#e8e4dc] bg-[#f8f7f4] px-3 py-2 text-sm focus:border-[#c8a96e] outline-none" placeholder="you@company.com" />
        {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex justify-between items-center mb-1"><label className="block text-sm font-medium">Password</label><Link href="#" className="text-xs font-medium text-[#c8a96e]">Forgot password?</Link></div>
        <div className="relative">
          <input type={showPassword ? "text" : "password"} {...register("password")} className="w-full rounded-md border border-[#e8e4dc] bg-[#f8f7f4] px-3 py-2 text-sm focus:border-[#c8a96e] outline-none pr-10" placeholder="••••••••" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
        {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-[#c8a96e] text-[#1a1a2e] py-2.5 text-sm font-semibold hover:bg-[#b89b60] disabled:opacity-50 flex items-center justify-center gap-2 uppercase tracking-widest">
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Signing in...</> : "Sign In"}
      </button>
    </form>
  );
}
