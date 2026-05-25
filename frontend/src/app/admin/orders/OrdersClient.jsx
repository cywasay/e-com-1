"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import AdminListPageSkeleton from "../_components/skeletons/AdminListPageSkeleton";
import OrdersFilters from "./_components/OrdersFilters";
import OrdersTable from "./_components/OrdersTable";
import OrderDetailsPanel from "./_components/OrderDetailsPanel";
import AdminPageHeader from "../_components/AdminPageHeader";

function OrdersClientInner() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [buyerType, setBuyerType] = useState("");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const id = searchParams.get("id");
    if (id) setSelectedOrderId(id);
  }, [searchParams]);

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
      queryClient.invalidateQueries(["admin-dashboard"]);
      toast.success("Order updated successfully");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update order");
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Orders"
        description="Review and update customer order status and fulfillment."
      />

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

export default function OrdersClient() {
  return (
    <Suspense fallback={<AdminListPageSkeleton showFilters tableColumns={7} />}>
      <OrdersClientInner />
    </Suspense>
  );
}
