"use client";
import { MapPin, User, Phone } from "lucide-react";

export default function CheckoutForm({ register, errors, onSubmit }) {
  return (
    <div className="bg-white border border-[#e8e4dc] rounded-2xl p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6"><MapPin className="w-5 h-5 text-[#c8a96e]" /><h2 className="text-xl font-semibold">Shipping Address</h2></div>
      <form id="checkout-form" onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Full Name</label>
          <div className="relative"><User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6560]" /><input {...register("fullName")} className="w-full pl-10 pr-4 py-2 bg-[#f8f7f4] border border-[#e8e4dc] rounded-lg focus:ring-1 focus:ring-[#c8a96e] outline-none" placeholder="John Doe" /></div>
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Phone</label>
          <div className="relative"><Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6b6560]" /><input {...register("phone")} className="w-full pl-10 pr-4 py-2 bg-[#f8f7f4] border border-[#e8e4dc] rounded-lg focus:ring-1 focus:ring-[#c8a96e] outline-none" placeholder="+971..." /></div>
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div><label className="block text-sm font-medium mb-2">City</label><input {...register("city")} className="w-full px-4 py-2 bg-[#f8f7f4] border border-[#e8e4dc] rounded-lg focus:ring-1 focus:ring-[#c8a96e] outline-none" placeholder="Dubai" />{errors.city && <p className="mt-1 text-xs text-red-500">{errors.city.message}</p>}</div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Address Line 1</label><input {...register("addressLine1")} className="w-full px-4 py-2 bg-[#f8f7f4] border border-[#e8e4dc] rounded-lg focus:ring-1 focus:ring-[#c8a96e] outline-none" placeholder="Street name..." />{errors.addressLine1 && <p className="mt-1 text-xs text-red-500">{errors.addressLine1.message}</p>}</div>
        <div className="md:col-span-2"><label className="block text-sm font-medium mb-2">Address Line 2</label><input {...register("addressLine2")} className="w-full px-4 py-2 bg-[#f8f7f4] border border-[#e8e4dc] rounded-lg focus:ring-1 focus:ring-[#c8a96e] outline-none" placeholder="Apartment..." /></div>
        <div><label className="block text-sm font-medium mb-2">Country</label><input {...register("country")} readOnly className="w-full px-4 py-2 bg-[#e8e4dc]/30 border border-[#e8e4dc] rounded-lg cursor-not-allowed outline-none text-[#6b6560]" /></div>
      </form>
    </div>
  );
}
