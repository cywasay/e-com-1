"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import OrderHistoryList from "./_components/OrderHistoryList";

export default function OrdersClient() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders").then(res => res.data.data),
  });

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Order History</h2>
        <p className="text-[14px] text-[#6b6560] mt-1">Track your recent orders and download invoices.</p>
      </div>

      <OrderHistoryList orders={ordersData?.data || []} isLoading={isLoading} />
    </div>
  );
}
