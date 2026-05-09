"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import CategoryTree from "./_components/CategoryTree";
import CategoryForm from "./_components/CategoryForm";

export default function CategoriesClient() {
  const queryClient = useQueryClient();
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", parent_id: "", sort_order: 0, is_active: true });

  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.get("/admin/categories").then(res => res.data)
  });

  const categories = categoriesResponse?.data || [];

  const getParentOptions = (items, currentId, depth = 0) => {
    let options = [];
    items.forEach(item => {
      if (item.id !== currentId && item.is_active) {
        options.push({ id: item.id, name: item.name, depth });
        if (item.children_recursive?.length > 0) {
          options = [...options, ...getParentOptions(item.children_recursive, currentId, depth + 1)];
        }
      }
    });
    return options;
  };

  const parentOptions = getParentOptions(categories, editingCategory?.id);

  const saveMutation = useMutation({
    mutationFn: (data) => editingCategory ? api.put(`/admin/categories/${editingCategory.id}`, data) : api.post("/admin/categories", data),
    onSuccess: () => { queryClient.invalidateQueries(["admin", "categories"]); handleClear(); }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/categories/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["admin", "categories"])
  });

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, parent_id: category.parent_id || "", sort_order: category.sort_order, is_active: category.is_active });
  };

  const handleClear = () => {
    setEditingCategory(null);
    setFormData({ name: "", parent_id: "", sort_order: 0, is_active: true });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Categories</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Manage product taxonomy and hierarchy</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7">
          <CategoryTree 
            categories={categories} isLoading={isLoading} 
            onEdit={handleEdit} onDelete={(id) => window.confirm("Delete?") && deleteMutation.mutate(id)} 
            editingId={editingCategory?.id} 
          />
        </div>
        <div className="lg:col-span-5">
          <CategoryForm 
            formData={formData} setFormData={setFormData} 
            isEditing={!!editingCategory} onClear={handleClear} 
            onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }} 
            isSaving={saveMutation.isPending} parentOptions={parentOptions} 
          />
        </div>
      </div>
    </div>
  );
}
