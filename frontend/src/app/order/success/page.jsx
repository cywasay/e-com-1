"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import useCartStore from "@/store/cartStore";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();

  useEffect(() => {
    // Clear the cart on the frontend since the order is now placed
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar dark={false} />
      <div className="flex-1 max-w-3xl mx-auto px-4 py-20 text-center flex flex-col justify-center w-full">
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 bg-[#2d7a4f]/10 rounded-full flex items-center justify-center text-[#2d7a4f]">
            <CheckCircle2 className="w-12 h-12" />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">
          Order Placed Successfully!
        </h1>
        <p className="text-lg text-[#6b6560] mb-12">
          Thank you for your purchase. Your order has been received and is being processed.
          {sessionId && (
            <span className="block mt-2 text-sm text-[#6b6560] font-mono">
              Session ID: {sessionId.substring(0, 20)}...
            </span>
          )}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/account/orders"
            className="flex items-center justify-center gap-2 p-6 bg-white border border-[#e8e4dc] rounded-2xl hover:border-[#c8a96e] transition-all group"
          >
            <div className="w-10 h-10 bg-[#f8f7f4] rounded-full flex items-center justify-center group-hover:bg-[#c8a96e]/10 group-hover:text-[#c8a96e] transition-colors">
              <Package className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1a1a2e]">View Orders</p>
              <p className="text-sm text-[#6b6560]">Track your shipment</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-[#e8e4dc] group-hover:text-[#c8a96e]" />
          </Link>

          <Link
            href="/products"
            className="flex items-center justify-center gap-2 p-6 bg-white border border-[#e8e4dc] rounded-2xl hover:border-[#c8a96e] transition-all group"
          >
            <div className="w-10 h-10 bg-[#f8f7f4] rounded-full flex items-center justify-center group-hover:bg-[#c8a96e]/10 group-hover:text-[#c8a96e] transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div className="text-left">
              <p className="font-semibold text-[#1a1a2e]">Continue Shopping</p>
              <p className="text-sm text-[#6b6560]">Explore more products</p>
            </div>
            <ArrowRight className="w-4 h-4 ml-auto text-[#e8e4dc] group-hover:text-[#c8a96e]" />
          </Link>
        </div>

        <div className="mt-16 p-8 bg-[#f8f7f4] rounded-3xl border border-dashed border-[#e8e4dc]">
          <p className="text-sm text-[#6b6560]">
            A confirmation email has been sent to your registered email address.
            If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#c8a96e]" /></div>}>
      <SuccessContent />
    </Suspense>
  );
}
