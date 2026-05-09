"use client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AddressForm({ register, errors, onSubmit, isPending, isSuccess }) {
  return (
    <div className="space-y-10">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#6b6560]">Update Address</h3>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-6">
          <Field label="Recipient Name" {...register("full_name")} error={errors.full_name} placeholder="Full Name" />
          <Field label="Phone Number" {...register("phone")} error={errors.phone} placeholder="+971..." />
          <Field label="Street Address" {...register("address_line_1")} error={errors.address_line_1} placeholder="Apt, Villa, Street" />
          <div className="grid grid-cols-2 gap-8">
            <Field label="City" {...register("city")} error={errors.city} placeholder="City" />
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#1a1a2e]">Emirate</label>
              <select {...register("emirates")} className="w-full bg-transparent border-b border-[#e8e4dc] py-2 text-[14px] focus:border-[#c8a96e] outline-none">
                {["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"].map(e => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 pt-4">
          <button type="submit" disabled={isPending} className="bg-[#1a1a2e] text-white px-10 py-3 rounded-full font-bold text-[13px] hover:bg-[#c8a96e] disabled:opacity-50 flex items-center gap-2">
            {isPending && <Loader2 size={14} className="animate-spin" />} Save address
          </button>
          {isSuccess && <div className="flex items-center gap-2 text-[#2d7a4f] text-[13px] font-medium animate-in fade-in slide-in-from-left-2"><CheckCircle2 size={16} /> Saved</div>}
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, ...props }) {
  return (
    <div className="space-y-2">
      <label className="text-[13px] font-semibold text-[#1a1a2e]">{label}</label>
      <input {...props} className={`w-full bg-transparent border-b ${error ? 'border-red-500' : 'border-[#e8e4dc]'} py-2 text-[14px] focus:border-[#c8a96e] outline-none transition-all`} />
      {error && <p className="text-[11px] text-red-500 font-medium">{error.message}</p>}
    </div>
  );
}
