"use client";
import { ArrowLeft, Loader2, Check } from "lucide-react";
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
      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">{editingId ? "Edit Product" : "Add New Product"}</h2>
        </div>
        <form onSubmit={onSubmit} className="p-8 space-y-12">
          {/* Section 1: Basic Info */}
          <div className="space-y-6">
            <ProductBasicInfo formData={formData} setFormData={setFormData} categoryOptions={categoryOptions} />
          </div>

          {/* Section 2: Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Product Description</label>
            <textarea 
              rows={6} 
              value={formData.description} 
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full bg-white border border-slate-200 px-4 py-3 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none shadow-sm"
              placeholder="Tell customers about your product..."
            />
          </div>

          {/* Section 3: Pricing */}
          <ProductPricing formData={formData} setFormData={setFormData} />

          {/* Section 4: Inventory */}
          <ProductInventory formData={formData} setFormData={setFormData} />

          {/* Section 5: Media */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-800">Media</h3>
            </div>
            <ProductImageUpload editingId={editingId} images={formData.images} {...imageMutations} />
          </div>

          {/* Section 5: Variants */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-800">Variants</h3>
            </div>
            <ProductVariants formData={formData} setFormData={setFormData} onGenerate={onGenerateVariants} onRemoveVariant={onRemoveVariant} />
          </div>

          {/* Section 6: Organization */}
          <div className="space-y-8 pt-8 border-t border-slate-100">
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Tags & Keywords</label>
              <ProductTags formData={formData} setFormData={setFormData} />
            </div>
            
            <div className="space-y-4">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Site Visibility</label>
              <ProductSiteSelect sites={sites} selectedSiteIds={formData.site_ids} onChange={(ids) => setFormData({...formData, site_ids: ids})} />
            </div>
          </div>

          <FormFooter isSaving={isSaving} onBack={onBack} editingId={editingId} />
        </form>
      </div>
    </div>
  );
}

function FormHeader({ onBack, status }) {
  return (
    <div className="flex items-center justify-between">
      <button onClick={onBack} className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-900 transition-colors"><ArrowLeft size={16} /> Back</button>
      <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200`}>{status}</span>
    </div>
  );
}

function FormFooter({ isSaving, onBack, editingId }) {
  return (
    <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
      <button type="button" onClick={onBack} className="px-6 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest">Cancel</button>
      <button type="submit" disabled={isSaving} className="bg-blue-600 text-white px-10 py-3 text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50">
        {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
        {editingId ? "Update Product" : "Save Product"}
      </button>
    </div>
  );
}
