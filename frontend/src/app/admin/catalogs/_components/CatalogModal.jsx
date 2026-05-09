"use client";
import { X } from "lucide-react";

export default function CatalogModal({ isOpen, onClose, editingCatalog, formData, setFormData, onSubmit, isSaving }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">{editingCatalog ? "Edit Catalog" : "Add Catalog"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={24} /></button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Name</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008060] outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Description</label><textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008060] outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Cover Image URL</label><input type="url" value={formData.cover_image} onChange={(e) => setFormData({ ...formData, cover_image: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008060] outline-none" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">PDF File URL *</label><input type="url" required value={formData.file_url} onChange={(e) => setFormData({ ...formData, file_url: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008060] outline-none" /></div>
            <div className="flex items-center gap-2"><input type="checkbox" id="is_active" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })} className="h-4 w-4 text-[#008060] border-gray-300 rounded" /><label htmlFor="is_active" className="text-sm font-medium text-gray-700">Active</label></div>
          </div>
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-[#008060] hover:bg-[#006e52] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors disabled:opacity-50">{isSaving ? "Saving..." : "Save Catalog"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
