"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import CaseStudiesHeader from "./_components/CaseStudiesHeader";
import CaseStudiesTable from "./_components/CaseStudiesTable";
import CaseStudyModal from "./_components/CaseStudyModal";

export default function CaseStudiesClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: casesData, isLoading } = useQuery({
    queryKey: ["admin-case-studies"],
    queryFn: () => api.get("/admin/case-studies").then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => editingCase ? api.put(`/admin/case-studies/${editingCase.id}`, data) : api.post("/admin/case-studies", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-case-studies"]);
      setIsModalOpen(false);
      setEditingCase(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/case-studies/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["admin-case-studies"])
  });

  const filteredCases = casesData?.data?.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.client_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <CaseStudiesHeader onAdd={() => { setEditingCase(null); setIsModalOpen(true); }} />
      
      <CaseStudiesTable 
        cases={filteredCases} 
        isLoading={isLoading} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onEdit={(item) => { setEditingCase(item); setIsModalOpen(true); }}
        onDelete={(id) => confirm("Delete?") && deleteMutation.mutate(id)}
      />

      <CaseStudyModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingCase={editingCase}
        onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); mutation.mutate(Object.fromEntries(fd.entries())); }}
        isSaving={mutation.isPending}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
