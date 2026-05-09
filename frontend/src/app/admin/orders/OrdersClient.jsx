"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import OrdersFilters from "./_components/OrdersFilters";
import OrdersTable from "./_components/OrdersTable";
import OrderDetailsPanel from "./_components/OrderDetailsPanel";

export default function OrdersClient() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const queryClient = useQueryClient();

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders", search, status, buyerType],
    queryFn: () => api.get(`/admin/orders`, {
      params: { search, status, buyer_type: buyerType }
    }).then(res => res.data.data),
  });

  const { data: orderDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-order-detail", selectedOrderId],
    queryFn: () => api.get(`/admin/orders/${selectedOrderId}`).then(res => res.data.data),
    enabled: !!selectedOrderId,
  });

  const updateStatusMutation = useMutation({
    mutationFn: (data) => api.put(`/admin/orders/${selectedOrderId}/status`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-orders"]);
      queryClient.invalidateQueries(["admin-order-detail", selectedOrderId]);
      alert("Order updated successfully");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Order Management</h3>
      </div>

      <OrdersFilters 
        search={search} setSearch={setSearch} 
        status={status} setStatus={setStatus} 
        buyerType={buyerType} setBuyerType={setBuyerType} 
      />

      <OrdersTable 
        orders={orders?.data || []} 
        isLoading={isLoading} 
        onSelectOrder={setSelectedOrderId} 
      />

      <OrderDetailsPanel 
        orderId={selectedOrderId} 
        onClose={() => setSelectedOrderId(null)} 
        orderDetail={orderDetail} 
        isLoading={isLoadingDetail} 
        onUpdateStatus={(data) => updateStatusMutation.mutate(data)} 
        isUpdating={updateStatusMutation.isPending} 
      />
    </div>
  );
}
