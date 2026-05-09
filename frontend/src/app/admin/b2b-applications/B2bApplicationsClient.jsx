"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import ApplicationsTabs from "./_components/ApplicationsTabs";
import ApplicationsTable from "./_components/ApplicationsTable";

export default function B2bApplicationsClient() {
  const [status, setStatus] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const queryClient = useQueryClient();

  const { data: apps, isLoading } = useQuery({
    queryKey: ["b2b-applications", status],
    queryFn: () => api.get(`/admin/b2b-applications${status ? `?status=${status}` : ""}`).then(res => res.data.data),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => api.put(`/admin/b2b-applications/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries(["b2b-applications"]);
      setExpandedId(null);
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, notes }) => api.put(`/admin/b2b-applications/${id}/reject`, { admin_notes: notes }),
    onSuccess: () => {
      queryClient.invalidateQueries(["b2b-applications"]);
      setExpandedId(null);
      setAdminNotes("");
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Wholesale Applications</h3>
      </div>

      <ApplicationsTabs status={status} setStatus={setStatus} />

      <ApplicationsTable 
        apps={apps?.data || []} 
        isLoading={isLoading} 
        expandedId={expandedId} 
        setExpandedId={setExpandedId}
        onApprove={(id) => approveMutation.mutate(id)}
        onReject={(data) => rejectMutation.mutate(data)}
        isApproving={approveMutation.isPending}
        isRejecting={rejectMutation.isPending}
        adminNotes={adminNotes}
        setAdminNotes={setAdminNotes}
      />
    </div>
  );
}
