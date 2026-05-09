"use client";
import { MapPin } from "lucide-react";

export default function AddressPreview({ user, isPending }) {
  return (
    <div className="space-y-8">
      <h3 className="text-xs font-bold uppercase tracking-widest text-[#6b6560]">Default Address</h3>
      {isPending || !user ? <LoadingPreview /> : user?.default_address ? (
        <div className="p-8 rounded-3xl bg-white shadow-sm border border-[#e8e4dc] space-y-6 relative overflow-hidden">
          <div className="space-y-4">
            <div><p className="text-sm font-bold text-[#1a1a2e]">{user.default_address.full_name}</p><p className="text-sm text-[#6b6560] mt-1">{user.default_address.phone}</p></div>
            <div className="text-sm text-[#1a1a2e] leading-relaxed">
              <p>{user.default_address.address_line_1}</p>
              {user.default_address.address_line_2 && <p>{user.default_address.address_line_2}</p>}
              <p>{user.default_address.city}, {user.default_address.emirates}</p>
              <p className="font-bold mt-2 uppercase tracking-widest text-[10px]">{user.default_address.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] font-bold text-[#c8a96e] uppercase tracking-[0.1em]"><div className="w-1.5 h-1.5 rounded-full bg-[#c8a96e]" /> Primary Shipping Address</div>
        </div>
      ) : (
        <div className="p-10 rounded-3xl border border-dashed border-[#e8e4dc] text-center space-y-3"><MapPin size={24} className="mx-auto text-[#e8e4dc]" /><p className="text-sm font-medium text-[#6b6560]">No address saved yet.</p></div>
      )}
    </div>
  );
}

function LoadingPreview() {
  return (
    <div className="p-8 rounded-3xl bg-white border border-[#e8e4dc] space-y-6 animate-pulse">
      <div className="space-y-4"><div className="h-4 w-32 bg-gray-100 rounded" /><div className="h-3 w-40 bg-gray-100 rounded" /><div className="space-y-2 pt-2"><div className="h-3 w-full bg-gray-100 rounded" /><div className="h-3 w-3/4 bg-gray-100 rounded" /></div></div>
    </div>
  );
}
