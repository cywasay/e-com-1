"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import OrderHistoryList from "./_components/OrderHistoryList";
import AccountPageHeader from "../_components/AccountPageHeader";

export default function OrdersClient() {
  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["my-orders"],
    queryFn: () => api.get("/orders").then(res => res.data.data),
  });

  return (
    <div className="space-y-8">
      <AccountPageHeader
        title="Order history"
        description="Track your recent orders and view order details."
      />

      <OrderHistoryList orders={ordersData?.data || []} isLoading={isLoading} />
    </div>
  );
}
