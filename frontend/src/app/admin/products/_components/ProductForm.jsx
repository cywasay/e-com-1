"use client";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ProductBasicInfo from "./ProductBasicInfo";
import ProductTags from "./ProductTags";
import ProductImageUpload from "./ProductImageUpload";
import ProductVariants from "./ProductVariants";
import ProductSiteSelect from "./ProductSiteSelect";
import ProductPricing from "./ProductPricing";
import ProductInventory from "./ProductInventory";

export default function ProductForm({ 
  formData, setFormData, editingId, onBack, onSubmit, isSaving, 
  categoryOptions, sites, imageMutations, onGenerateVariants, onRemoveVariant 
}) {
  return (
    <div className="space-y-6 max-w-4xl">
      <FormHeader onBack={onBack} status={formData.status} />
      <Card className="overflow-hidden py-0 shadow-sm">
        <CardHeader className="px-8 py-5 border-b border-border bg-muted/50">
          <h2 className="text-sm font-bold text-foreground uppercase tracking-widest">{editingId ? "Edit Product" : "Add New Product"}</h2>
        </CardHeader>
        <CardContent className="p-0">
          <form onSubmit={onSubmit} className="p-8 space-y-12">
            <div className="space-y-6">
              <ProductBasicInfo formData={formData} setFormData={setFormData} categoryOptions={categoryOptions} />
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product Description</Label>
              <Textarea
                rows={6}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="resize-none"
                placeholder="Tell customers about your product..."
              />
            </div>

            <ProductPricing formData={formData} setFormData={setFormData} />
            <ProductInventory formData={formData} setFormData={setFormData} />

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-sm font-semibold text-foreground">Media</h3>
              </div>
              <ProductImageUpload editingId={editingId} images={formData.images} {...imageMutations} />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <h3 className="text-sm font-semibold text-foreground">Variants</h3>
              </div>
              <ProductVariants formData={formData} setFormData={setFormData} onGenerate={onGenerateVariants} onRemoveVariant={onRemoveVariant} />
            </div>

            <div className="space-y-8 pt-8 border-t border-border">
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Tags & Keywords</Label>
                <ProductTags formData={formData} setFormData={setFormData} />
              </div>
              <div className="space-y-4">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Site Visibility</Label>
                <ProductSiteSelect sites={sites} selectedSiteIds={formData.site_ids} onChange={(ids) => setFormData({ ...formData, site_ids: ids })} />
              </div>
            </div>

            <FormFooter isSaving={isSaving} onBack={onBack} editingId={editingId} />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function FormHeader({ onBack, status }) {
  return (
    <div className="flex items-center justify-between">
      <Button type="button" variant="ghost" onClick={onBack} className="text-xs font-bold uppercase tracking-widest">
        <ArrowLeft size={16} /> Back
      </Button>
      <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{status}</Badge>
    </div>
  );
}

function FormFooter({ isSaving, onBack, editingId }) {
  return (
    <div className="pt-8 border-t border-border flex items-center justify-end gap-3">
      <Button type="button" variant="ghost" onClick={onBack} className="text-xs font-bold uppercase tracking-widest">
        Cancel
      </Button>
      <Button type="submit" disabled={isSaving} className="text-xs font-bold uppercase tracking-widest">
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        {editingId ? "Update Product" : "Save Product"}
      </Button>
    </div>
  );
}
