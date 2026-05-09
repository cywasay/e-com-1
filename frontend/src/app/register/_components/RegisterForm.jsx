"use client";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";

export default function RegisterForm({ register, errors, isSubmitting, onSubmit, serverError, selectedRole }) {
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {serverError && <div className="mb-6 p-3 rounded-md bg-red-50 text-red-600 text-sm border border-red-100 flex items-start gap-2"><span className="mt-0.5">•</span>{serverError}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-2">Account Type</label>
        <div className="grid grid-cols-2 gap-4">
          <RoleOption label="Individual" value="b2c_customer" active={selectedRole === 'b2c_customer'} register={register} />
          <RoleOption label="Corporate (B2B)" value="b2b_buyer" active={selectedRole === 'b2b_buyer'} register={register} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Field label="Full Name" {...register("name")} error={errors.name} placeholder="John Doe" />
        <Field label="Phone" {...register("phone")} error={errors.phone} placeholder="+971..." />
      </div>

      <Field label="Email Address" {...register("email")} error={errors.email} placeholder="you@company.com" />

      {selectedRole === "b2b_buyer" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-4 bg-[#f8f7f4] border border-[#e8e4dc] rounded-md">
          <Field label="Company Name *" {...register("company_name")} error={errors.company_name} placeholder="Company LLC" bgColor="bg-white" />
          <Field label="TRN / Tax ID *" {...register("tax_id")} error={errors.tax_id} placeholder="1000..." bgColor="bg-white" />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <PasswordField label="Password" {...register("password")} error={errors.password} show={showPass} setShow={setShowPass} />
        <PasswordField label="Confirm Password" {...register("password_confirmation")} error={errors.password_confirmation} show={showConf} setShow={setShowConf} />
      </div>

      <button type="submit" disabled={isSubmitting} className="w-full rounded-md bg-[#c8a96e] text-[#1a1a2e] py-2.5 text-sm font-semibold hover:bg-[#b89b60] disabled:opacity-50 flex items-center justify-center gap-2 mt-4 uppercase tracking-widest">
        {isSubmitting ? <><Loader2 size={16} className="animate-spin" /> Creating account...</> : "Create Account"}
      </button>
    </form>
  );
}

function RoleOption({ label, value, active, register }) {
  return (
    <label className={`flex items-center justify-center py-2.5 px-4 border rounded-md cursor-pointer transition-colors ${active ? 'border-[#c8a96e] bg-[#c8a96e]/10' : 'border-[#e8e4dc] hover:bg-[#f8f7f4]'}`}>
      <input type="radio" value={value} {...register("role")} className="hidden" />
      <span className="text-sm font-semibold">{label}</span>
    </label>
  );
}

function Field({ label, error, bgColor = "bg-[#f8f7f4]", ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input {...props} className={`w-full rounded-md border border-[#e8e4dc] ${bgColor} px-3 py-2 text-sm focus:border-[#c8a96e] outline-none`} />
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}

function PasswordField({ label, error, show, setShow, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <div className="relative">
        <input type={show ? "text" : "password"} {...props} className="w-full rounded-md border border-[#e8e4dc] bg-[#f8f7f4] px-3 py-2 text-sm focus:border-[#c8a96e] outline-none pr-10" placeholder="••••••••" />
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6b6560] hover:text-[#1a1a2e] transition-colors">{show ? <EyeOff size={16} /> : <Eye size={16} />}</button>
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
    </div>
  );
}
