"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import CatalogHeader from "./_components/CatalogHeader";
import CatalogTable from "./_components/CatalogTable";
import CatalogModal from "./_components/CatalogModal";

export default function CatalogsClient() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCatalog, setEditingCatalog] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "", cover_image: "", file_url: "", is_active: true });

  const { data: catalogs, isLoading } = useQuery({
    queryKey: ["admin", "catalogs"],
    queryFn: () => api.get("/admin/catalogs").then(res => res.data.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => editingCatalog ? api.put(`/admin/catalogs/${editingCatalog.id}`, data) : api.post("/admin/catalogs", data),
    onSuccess: () => { queryClient.invalidateQueries(["admin", "catalogs"]); setIsModalOpen(false); setEditingCatalog(null); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/catalogs/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["admin", "catalogs"])
  });

  const handleEdit = (catalog) => {
    setEditingCatalog(catalog);
    setFormData({ name: catalog.name, description: catalog.description || "", cover_image: catalog.cover_image || "", file_url: catalog.file_url, is_active: catalog.is_active });
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingCatalog(null);
    setFormData({ name: "", description: "", cover_image: "", file_url: "", is_active: true });
    setIsModalOpen(true);
  };

  const filteredCatalogs = catalogs?.data?.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase())) || [];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <CatalogHeader onAdd={handleAdd} />
      <CatalogTable 
        catalogs={filteredCatalogs} 
        isLoading={isLoading} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm}
        onEdit={handleEdit}
        onDelete={(id) => confirm("Delete?") && deleteMutation.mutate(id)}
      />
      <CatalogModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingCatalog={editingCatalog}
        formData={formData}
        setFormData={setFormData}
        onSubmit={(e) => { e.preventDefault(); mutation.mutate(formData); }}
        isSaving={mutation.isPending}
      />
    </div>
  );
}
