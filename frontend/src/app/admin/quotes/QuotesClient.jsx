"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import QuotesFilters from "./_components/QuotesFilters";
import QuotesTable from "./_components/QuotesTable";
import AdminPageHeader from "../_components/AdminPageHeader";

export default function QuotesClient() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const queryClient = useQueryClient();

  const { data: quotesData, isLoading } = useQuery({
    queryKey: ["admin-quotes", statusFilter],
    queryFn: () => api.get(`/admin/quotes${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`).then(res => res.data.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, admin_notes }) => api.put(`/admin/quotes/${id}/status`, { status, admin_notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
      queryClient.invalidateQueries({ queryKey: ["admin-dashboard"] });
      toast.success("Quote updated");
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to update quote");
    },
  });

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quote requests"
        description="Manage inbound B2B and contact quote inquiries."
      />

      <QuotesFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <QuotesTable 
        quotes={quotesData?.data || []} 
        isLoading={isLoading} 
        expandedId={expandedId} 
        setExpandedId={setExpandedId}
        onUpdate={(id, status, notes) => updateMutation.mutate({ id, status, admin_notes: notes })}
        isUpdating={updateMutation.isPending}
      />
    </div>
  );
}
