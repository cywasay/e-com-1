"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import api from "@/lib/api";
import PriceSetList from "./_components/PriceSetList";
import PriceSetDetail from "./_components/PriceSetDetail";
import PricePreviewTool from "./_components/PricePreviewTool";
import CreatePriceSetModal from "./_components/CreatePriceSetModal";
import AdminPageHeader from "../_components/AdminPageHeader";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PricingClient() {
  const [selectedSetId, setSelectedSetId] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const queryClient = useQueryClient();

  // Price Preview State
  const [previewProductId, setPreviewProductId] = useState("");
  const [previewUserId, setPreviewUserId] = useState("");

  const { data: priceSets, isLoading } = useQuery({
    queryKey: ["admin-price-sets"],
    queryFn: () => api.get("/admin/price-sets").then(res => res.data.data),
  });

  const { data: setDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["admin-price-set-detail", selectedSetId],
    queryFn: () => api.get(`/admin/price-sets/${selectedSetId}`).then(res => res.data.data),
    enabled: !!selectedSetId,
  });

  const { data: products } = useQuery({
    queryKey: ["admin-products-minimal"],
    queryFn: () => api.get("/admin/products").then(res => res.data.data.data),
  });

  const { data: customers } = useQuery({
    queryKey: ["admin-customers-minimal"],
    queryFn: () => api.get("/admin/customers").then(res => res.data.data.data),
  });

  const previewMutation = useMutation({
    mutationFn: (data) => api.post("/admin/pricing/preview", data).then(res => res.data.data),
    onError: (error) => toast.error(error.response?.data?.message || "Preview failed"),
  });

  const createMutation = useMutation({
    mutationFn: (data) => api.post("/admin/price-sets", data),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["admin-price-sets"]);
      setShowCreateModal(false);
      setSelectedSetId(res.data.data.id);
      toast.success("Price set created");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to create price set"),
  });

  const addItemMutation = useMutation({
    mutationFn: (data) => api.post(`/admin/price-sets/${selectedSetId}/items`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-price-set-detail", selectedSetId]);
      toast.success("Price item added");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to add price item"),
  });

  const removeItemMutation = useMutation({
    mutationFn: (itemId) => api.delete(`/admin/price-sets/${selectedSetId}/items/${itemId}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-price-set-detail", selectedSetId]);
      toast.success("Price item removed");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to remove price item"),
  });

  const assignMutation = useMutation({
    mutationFn: (data) => api.post(`/admin/price-sets/${selectedSetId}/assignments`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-price-set-detail", selectedSetId]);
      toast.success("Assignment saved");
    },
    onError: (error) => toast.error(error.response?.data?.message || "Failed to save assignment"),
  });

  return (
    <div className="space-y-12 pb-20">
      <AdminPageHeader
        title="Pricing"
        description="Configure price sets, wholesale tiers, and preview resolved prices."
        actions={
          <Button onClick={() => setShowCreateModal(true)} size="sm">
            <Plus size={14} /> Create price set
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <PriceSetList priceSets={priceSets} isLoading={isLoading} selectedSetId={selectedSetId} onSelect={setSelectedSetId} />
        </div>
        <div className="lg:col-span-2">
          <PriceSetDetail 
            setDetail={setDetail} isLoading={isLoadingDetail} 
            onAssign={(data) => assignMutation.mutate(data)} 
            onAddItem={(data) => addItemMutation.mutate(data)} 
            onRemoveItem={(id) => removeItemMutation.mutate(id)} 
          />
        </div>
      </div>

      <PricePreviewTool 
        products={products} customers={customers} 
        previewProductId={previewProductId} setPreviewProductId={setPreviewProductId} 
        previewUserId={previewUserId} setPreviewUserId={setPreviewUserId} 
        onPreview={() => previewMutation.mutate({ product_id: previewProductId, user_id: previewUserId || null })} 
        isPending={previewMutation.isPending} 
        previewData={previewMutation.data} 
      />

      <CreatePriceSetModal 
        isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} 
        onCreate={(data) => createMutation.mutate(data)} isPending={createMutation.isPending} 
      />
    </div>
  );
}
