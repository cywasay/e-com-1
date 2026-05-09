"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import QuotesFilters from "./_components/QuotesFilters";
import QuotesTable from "./_components/QuotesTable";

export default function QuotesClient() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);
  const queryClient = useQueryClient();

  const { data: quotesData, isLoading } = useQuery({
    queryKey: ["admin-quotes", statusFilter],
    queryFn: () => api.get(`/admin/quotes${statusFilter !== "all" ? `?status=${statusFilter}` : ""}`).then(res => res.data.data),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, admin_notes }) => api.put(`/admin/quotes/${id}/status`, { status, admin_notes }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-quotes"] });
      setUpdateResult(variables.id);
      setTimeout(() => setUpdateResult(null), 3000);
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900">Quote Requests</h1>
      </div>

      <QuotesFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />

      <QuotesTable 
        quotes={quotesData?.data || []} 
        isLoading={isLoading} 
        expandedId={expandedId} 
        setExpandedId={setExpandedId}
        onUpdate={(id, status, notes) => updateMutation.mutate({ id, status, admin_notes: notes })}
        isUpdating={updateMutation.isPending}
        updateResult={updateResult}
      />
    </div>
  );
}
