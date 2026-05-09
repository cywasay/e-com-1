"use client";
import OrderHistoryItem from "./OrderHistoryItem";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function OrderHistoryList({ orders, isLoading }) {
  if (isLoading) return <LoadingSkeleton />;
  if (orders?.length === 0) return <EmptyState />;

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderHistoryItem key={order.id} order={order} />
      ))}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white border border-[#e8e4dc] rounded-2xl p-6 animate-pulse flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-6"><div className="w-12 h-12 rounded-xl bg-gray-100" /><div className="space-y-2"><div className="h-4 w-32 bg-gray-100 rounded" /><div className="h-3 w-40 bg-gray-100 rounded" /></div></div>
          <div className="flex items-center gap-10"><div className="text-right space-y-1"><div className="h-3 w-16 bg-gray-100 rounded ml-auto" /><div className="h-5 w-24 bg-gray-100 rounded ml-auto" /></div><div className="w-10 h-10 rounded-full bg-gray-100" /></div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="py-24 text-center space-y-6">
      <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto text-[#c8a96e]"><ShoppingBag size={40} /></div>
      <div><p className="text-lg font-bold text-[#1a1a2e]">No orders found</p><p className="text-[14px] text-[#6b6560] mt-1">When you make a purchase, it will appear here.</p></div>
      <Link href="/products" className="inline-block bg-[#1a1a2e] text-white px-10 py-3 rounded-full font-bold text-[13px] hover:bg-[#c8a96e] transition-all">Go to catalog</Link>
    </div>
  );
}
