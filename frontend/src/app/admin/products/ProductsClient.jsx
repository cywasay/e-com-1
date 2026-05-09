"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import ProductsHeader from "./_components/ProductsHeader";
import ProductsFilters from "./_components/ProductsFilters";
import ProductsTable from "./_components/ProductsTable";
import ProductForm from "./_components/ProductForm";
import ImportModal from "./_components/ImportModal";

export default function ProductsClient() {
  const queryClient = useQueryClient();
  const [view, setView] = useState("list"); // "list" or "form"
  const [editingId, setEditingId] = useState(null);
  const [showImportModal, setShowImportModal] = useState(false);
  
  // List State
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(1);

  // Form State
  const [formData, setFormData] = useState({
    name: "", category_id: "", price: "", description: "", status: "draft", visibility: "both",
    is_featured: false, is_bestseller: false, is_eco_friendly: false, is_new_arrival: false,
    site_ids: [], images: [], optionTypes: [], variants: []
  });

  const [deletedVariantIds, setDeletedVariantIds] = useState([]);

  // Data Fetching
  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["admin", "products", page, search, statusFilter, categoryFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: page.toString(), search, status: statusFilter, category_id: categoryFilter });
      return api.get(`/admin/products?${params.toString()}`).then(res => res.data);
    }
  });

  const { data: categoriesResponse } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => api.get("/admin/categories").then(res => res.data)
  });

  const { data: sitesResponse } = useQuery({
    queryKey: ["admin", "sites"],
    queryFn: () => api.get("/admin/sites").then(res => res.data)
  });

  // Category Options Flattening
  const getCategoryOptions = (items, path = "") => {
    let options = [];
    items?.forEach(item => {
      const currentPath = path ? `${path} > ${item.name}` : item.name;
      options.push({ id: item.id, name: currentPath });
      if (item.children_recursive?.length > 0) {
        options = [...options, ...getCategoryOptions(item.children_recursive, currentPath)];
      }
    });
    return options;
  };

  const categoryOptions = getCategoryOptions(categoriesResponse?.data || []);

  // Mutations
  const saveMutation = useMutation({
    mutationFn: (data) => {
      const payload = { ...data };
      if (!payload.category_id) payload.category_id = null;
      if (!payload.price) payload.price = null;
      console.log("Submitting Product Data:", payload);
      return editingId ? api.put(`/admin/products/${editingId}`, payload) : api.post("/admin/products", payload);
    },
    onSuccess: async (response) => {
      const productId = editingId || response.data?.data?.id || response.data?.id;
      if (!productId) return;
      
      try {
        const variantPromises = [];
        deletedVariantIds.forEach(id => variantPromises.push(api.delete(`/admin/products/${productId}/variants/${id}`)));
        formData.variants.forEach(v => {
          const vPayload = { 
            sku: v.sku, 
            options: v.options, 
            price: v.price || null, 
            stock_qty: v.stock_qty || 0, 
            is_active: v.is_active 
          };
          variantPromises.push(v.id ? api.put(`/admin/products/${productId}/variants/${v.id}`, vPayload) : api.post(`/admin/products/${productId}/variants`, vPayload));
        });
        await Promise.all(variantPromises);
      } catch (e) {
        console.error("Error saving variants:", e);
      }
      queryClient.invalidateQueries(["admin", "products"]);
      setView("list");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/products/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["admin", "products"])
  });

  const uploadImagesMutation = useMutation({
    mutationFn: (files) => {
      const fd = new FormData();
      for (let i = 0; i < files.length; i++) fd.append("images[]", files[i]);
      return api.post(`/admin/products/${editingId}/images`, fd, { headers: { "Content-Type": "multipart/form-data" } });
    },
    onSuccess: (res) => {
      setFormData(prev => ({ ...prev, images: [...prev.images, ...res.data.data] }));
      queryClient.invalidateQueries(["admin", "products"]);
    }
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (imageId) => api.put(`/admin/products/${editingId}/images/${imageId}/primary`),
    onSuccess: () => queryClient.invalidateQueries(["admin", "products"])
  });

  const deleteImageMutation = useMutation({
    mutationFn: (imageId) => api.delete(`/admin/products/${editingId}/images/${imageId}`),
    onSuccess: () => queryClient.invalidateQueries(["admin", "products"])
  });

  const importMutation = useMutation({
    mutationFn: (file) => {
      const fd = new FormData();
      fd.append("file", file);
      return api.post("/admin/products/import", fd, { headers: { "Content-Type": "multipart/form-data" } }).then(res => res.data);
    },
    onSuccess: () => queryClient.invalidateQueries(["admin", "products"])
  });

  const generateVariants = () => {
    const validOptions = formData.optionTypes.filter(ot => ot.name && ot.values.trim());
    if (validOptions.length === 0) return;
    const parsedOptions = validOptions.map(ot => ({ name: ot.name.toLowerCase(), values: ot.values.split(',').map(v => v.trim()).filter(v => v) }));
    const getCombinations = (arrays) => arrays.reduce((acc, curr) => {
      const results = [];
      acc.forEach(a => curr.values.forEach(b => results.push({ ...a, [curr.name]: b })));
      return results;
    }, [{}]);
    const combinations = getCombinations(parsedOptions);
    const newVariants = combinations.map(combo => formData.variants.find(v => JSON.stringify(v.options) === JSON.stringify(combo)) || { sku: "", options: combo, price: formData.price, stock_qty: 0, is_active: true });
    setFormData({ ...formData, variants: newVariants });
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name, category_id: product.category_id || "", price: product.price || "", description: product.description || "",
      status: product.status, visibility: product.visibility || "both", is_featured: product.is_featured, is_bestseller: product.is_bestseller, is_eco_friendly: product.is_eco_friendly,
      is_new_arrival: product.is_new_arrival, site_ids: product.sites?.map(s => s.id) || [], images: product.images || [],
      optionTypes: [], variants: product.variants || []
    });
    setView("form");
  };

  if (view === "form") {
    return (
      <ProductForm 
        formData={formData} setFormData={setFormData} editingId={editingId} 
        onBack={() => setView("list")} onSubmit={(e) => { e.preventDefault(); saveMutation.mutate(formData); }}
        isSaving={saveMutation.isPending} categoryOptions={categoryOptions} sites={sitesResponse?.data || []}
        imageMutations={{ onUpload: (f) => uploadImagesMutation.mutate(f), onSetPrimary: (id) => setPrimaryMutation.mutate(id), onDelete: (id) => deleteImageMutation.mutate(id), isUploading: uploadImagesMutation.isPending, isSettingPrimary: setPrimaryMutation.isPending }}
        onGenerateVariants={generateVariants} onRemoveVariant={(v, idx) => { if (v.id) setDeletedVariantIds(prev => [...prev, v.id]); const newV = formData.variants.filter((_, i) => i !== idx); setFormData({ ...formData, variants: newV }); }}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ProductsHeader onAdd={() => { setEditingId(null); setFormData({ name: "", category_id: "", price: "", description: "", status: "draft", visibility: "both", is_featured: false, is_bestseller: false, is_eco_friendly: false, is_new_arrival: false, site_ids: [], images: [], optionTypes: [], variants: [] }); setView("form"); }} onImport={() => setShowImportModal(true)} />
      <ProductsFilters search={search} setSearch={setSearch} statusFilter={statusFilter} setStatusFilter={setStatusFilter} categoryFilter={categoryFilter} setCategoryFilter={setCategoryFilter} categoryOptions={categoryOptions} />
      <ProductsTable products={productsData?.data?.data || []} isLoading={isLoadingProducts} onEdit={handleEdit} onDelete={(id) => window.confirm("Delete?") && deleteMutation.mutate(id)} page={page} setPage={setPage} lastPage={productsData?.data?.last_page || 1} />
      <ImportModal isOpen={showImportModal} onClose={() => setShowImportModal(false)} onImport={(f) => importMutation.mutate(f)} isImporting={importMutation.isPending} result={importMutation.data} onDownloadTemplate={() => {}} />
    </div>
  );
}
