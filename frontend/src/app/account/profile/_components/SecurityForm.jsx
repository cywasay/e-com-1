"use client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function SecurityForm({ register, errors, onSubmit, isPending, isSuccess }) {
  return (
    <section className="space-y-10 pt-10 border-t border-[#f0f0f0]">
      <div><h3 className="text-xl font-bold text-[#1a1a2e]">Security</h3><p className="text-[14px] text-[#6b6560] mt-1">Update your password.</p></div>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-2 max-w-sm">
          <label className="text-[13px] font-semibold text-[#1a1a2e]">Current Password</label>
          <input type="password" {...register("current_password")} className={`w-full bg-transparent border-b ${errors.current_password ? 'border-red-500' : 'border-[#e8e4dc]'} py-2 text-[14px] focus:outline-none focus:border-[#c8a96e]`} placeholder="••••••••" />
          {errors.current_password && <p className="text-[11px] text-red-500 font-medium">{errors.current_password.message}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-[#1a1a2e]">New Password</label>
            <input type="password" {...register("new_password")} className={`w-full bg-transparent border-b ${errors.new_password ? 'border-red-500' : 'border-[#e8e4dc]'} py-2 text-[14px] focus:outline-none focus:border-[#c8a96e]`} placeholder="Min 8 characters" />
            {errors.new_password && <p className="text-[11px] text-red-500 font-medium">{errors.new_password.message}</p>}
          </div>
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-[#1a1a2e]">Confirm New Password</label>
            <input type="password" {...register("new_password_confirmation")} className={`w-full bg-transparent border-b ${errors.new_password_confirmation ? 'border-red-500' : 'border-[#e8e4dc]'} py-2 text-[14px] focus:outline-none focus:border-[#c8a96e]`} placeholder="Confirm" />
            {errors.new_password_confirmation && <p className="text-[11px] text-red-500 font-medium">{errors.new_password_confirmation.message}</p>}
          </div>
        </div>
        <div className="flex items-center gap-6 pt-4">
          <button type="submit" disabled={isPending} className="bg-[#1a1a2e] text-white px-10 py-3 rounded-full font-bold text-[13px] hover:bg-[#c8a96e] disabled:opacity-50 flex items-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin" />} Update password
          </button>
          {isSuccess && <div className="flex items-center gap-2 text-[#2d7a4f] text-[13px] font-medium animate-in fade-in slide-in-from-left-2"><CheckCircle2 size={16} /> Updated</div>}
        </div>
      </form>
    </section>
  );
}
