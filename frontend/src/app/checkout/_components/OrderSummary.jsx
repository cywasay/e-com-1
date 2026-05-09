"use client";
import { Loader2, ArrowRight, CreditCard } from "lucide-react";

export default function OrderSummary({ items, total, isPending }) {
  return (
    <div className="bg-white border border-[#e8e4dc] rounded-2xl p-6 shadow-sm sticky top-24">
      <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={`${item.product_id}-${item.variant_id}`} className="flex justify-between items-start gap-4">
            <div className="flex-1"><p className="text-sm font-medium line-clamp-1">{item.name}</p><p className="text-xs text-[#6b6560]">Qty: {item.quantity}</p></div>
            <p className="text-sm font-semibold">AED {(item.price * item.quantity).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="border-t border-[#e8e4dc] pt-4 space-y-2 mb-6">
        <div className="flex justify-between text-sm text-[#6b6560]"><span>Subtotal</span><span>AED {total.toLocaleString()}</span></div>
        <div className="flex justify-between text-sm text-[#6b6560]"><span>Shipping</span><span className="text-[#2d7a4f] font-medium">Free</span></div>
        <div className="flex justify-between text-lg font-bold pt-2 border-t border-[#e8e4dc]"><span>Total</span><span>AED {total.toLocaleString()}</span></div>
      </div>
      <button type="submit" form="checkout-form" disabled={isPending} className="w-full bg-[#c8a96e] hover:bg-[#b89b60] disabled:bg-[#f8f7f4] disabled:text-[#6b6560] text-[#1a1a2e] py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all uppercase tracking-widest text-sm">
        {isPending ? <><Loader2 size={20} className="animate-spin" /> Processing...</> : <><ArrowRight size={20} /> Place Order</>}
      </button>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-[#6b6560]"><CreditCard size={12} /><span>Secure payment powered by Stripe</span></div>
    </div>
  );
}
