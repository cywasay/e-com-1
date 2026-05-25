"use client";

import Link from "next/link";
import { CheckCircle2, Package, ArrowRight, ShoppingBag, Loader2, AlertTriangle } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import useCartStore from "@/store/cartStore";
import api from "@/lib/api";
import StorefrontLayout from "@/components/StorefrontLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCartStore();
  const [verified, setVerified] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["checkout-verify", sessionId],
    queryFn: () => api.get(`/checkout/session/${sessionId}`).then((res) => res.data.data),
    enabled: !!sessionId,
    retry: 1,
  });

  useEffect(() => {
    if (data?.payment_status === "paid") {
      clearCart();
      setVerified(true);
    }
  }, [data, clearCart]);

  return (
    <StorefrontLayout>
      <div className="max-w-3xl mx-auto px-4 py-20 text-center flex flex-col justify-center w-full">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="w-10 h-10 animate-spin text-accent" />
            <p className="text-muted-foreground">Confirming your payment...</p>
          </div>
        ) : isError || (sessionId && !verified && data?.payment_status !== "paid") ? (
          <>
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-12 h-12" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">Payment confirmation pending</h1>
            <p className="text-muted-foreground mb-8">
              Your payment may still be processing. Check your account orders in a few minutes.
            </p>
            <Link href="/account/orders" className="text-accent font-semibold hover:underline">View orders</Link>
          </>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <div className="w-20 h-20 bg-[#2d7a4f]/10 rounded-full flex items-center justify-center text-[#2d7a4f]">
                <CheckCircle2 className="w-12 h-12" />
              </div>
            </div>

            <h1 className="text-4xl font-bold text-[#1a1a2e] mb-4">Order Placed Successfully!</h1>
            <p className="text-lg text-[#6b6560] mb-4">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            {data?.amount_total != null && (
              <p className="text-sm font-semibold text-foreground mb-12">
                Total paid: {data.currency || "AED"} {Number(data.amount_total).toLocaleString()}
              </p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/account/orders" className="flex items-center justify-center gap-2 p-6 bg-white border border-[#e8e4dc] rounded-2xl hover:border-[#c8a96e] transition-all group">
                <div className="w-10 h-10 bg-[#f8f7f4] rounded-full flex items-center justify-center group-hover:bg-[#c8a96e]/10 group-hover:text-[#c8a96e] transition-colors">
                  <Package className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1a1a2e]">View Orders</p>
                  <p className="text-sm text-[#6b6560]">Track your shipment</p>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto text-[#e8e4dc] group-hover:text-[#c8a96e]" />
              </Link>

              <Link href="/products" className="flex items-center justify-center gap-2 p-6 bg-white border border-[#e8e4dc] rounded-2xl hover:border-[#c8a96e] transition-all group">
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
          </>
        )}
      </div>
    </StorefrontLayout>
  );
}

export default function OrderSuccessPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="min-h-screen bg-[#f8f7f4] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-[#c8a96e]" /></div>}>
        <SuccessContent />
      </Suspense>
    </ProtectedRoute>
  );
}
