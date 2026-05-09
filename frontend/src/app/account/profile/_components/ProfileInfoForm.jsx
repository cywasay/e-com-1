"use client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function ProfileInfoForm({ user, register, errors, onSubmit, isPending, isSuccess }) {
  return (
    <section className="space-y-10">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {!user ? <LoadingFields /> : (
            <>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#1a1a2e]">Full Name</label>
                <input {...register("name")} className={`w-full bg-transparent border-b ${errors.name ? 'border-red-500' : 'border-[#e8e4dc]'} py-2 text-[14px] focus:outline-none focus:border-[#c8a96e]`} placeholder="Your Name" />
                {errors.name && <p className="text-[11px] text-red-500 font-medium">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#1a1a2e]">Email</label>
                <div className="py-2 text-[14px] text-[#6b6560] border-b border-[#e8e4dc]/50 italic">{user?.email}</div>
              </div>
              {user?.role === 'b2b_buyer' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-[13px] font-semibold text-[#1a1a2e]">Company Name</label>
                  <input {...register("company_name")} className="w-full bg-transparent border-b border-[#e8e4dc] py-2 text-[14px] focus:outline-none focus:border-[#c8a96e]" placeholder="Company LLC" />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-6 pt-4">
          <button type="submit" disabled={isPending} className="bg-[#1a1a2e] text-white px-10 py-3 rounded-full font-bold text-[13px] hover:bg-[#c8a96e] disabled:opacity-50 flex items-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin" />} Save changes
          </button>
          {isSuccess && <div className="flex items-center gap-2 text-[#2d7a4f] text-[13px] font-medium animate-in fade-in slide-in-from-left-2"><CheckCircle2 size={16} /> Saved</div>}
        </div>
      </form>
    </section>
  );
}

function LoadingFields() {
  return [...Array(3)].map((_, i) => (
    <div key={i} className="space-y-4 animate-pulse"><div className="h-4 w-24 bg-gray-100 rounded" /><div className="h-10 w-full bg-gray-100 rounded border-b border-gray-100" /></div>
  ));
}
