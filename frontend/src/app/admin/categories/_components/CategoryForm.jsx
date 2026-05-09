"use client";
import { Plus, Loader2, Check } from "lucide-react";

export default function CategoryForm({ formData, setFormData, isEditing, onClear, onSubmit, isSaving, parentOptions }) {
  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">{isEditing ? 'Edit Category' : 'Create New Category'}</h3>
          {isEditing && <button onClick={onClear} className="text-[10px] font-bold text-blue-600 uppercase tracking-wider flex items-center gap-1"><Plus size={12} /> New</button>}
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Category Name</label>
            <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500" placeholder="e.g., Corporate Wear" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Parent Category</label>
            <select value={formData.parent_id} onChange={(e) => setFormData({...formData, parent_id: e.target.value})} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500">
              <option value="">None (Top Level)</option>
              {parentOptions.map(opt => <option key={opt.id} value={opt.id}>{'\u00A0'.repeat(opt.depth * 2)} {opt.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Sort Order</label>
              <input type="number" value={formData.sort_order} onChange={(e) => setFormData({...formData, sort_order: parseInt(e.target.value)})} className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Status</label>
              <StatusToggle active={formData.is_active} onToggle={() => setFormData({...formData, is_active: !formData.is_active})} />
            </div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
            <button type="submit" disabled={isSaving} className="flex-1 bg-blue-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {isSaving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? <Check size={14} /> : <Plus size={14} />}
              {isEditing ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={onClear} className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors">Clear</button>
          </div>
        </form>
      </div>
      <ProTip />
    </div>
  );
}

function StatusToggle({ active, onToggle }) {
  return (
    <div className="flex items-center gap-2 h-[42px]">
      <button type="button" onClick={onToggle} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${active ? 'bg-blue-600' : 'bg-slate-200'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${active ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
      <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{active ? 'Active' : 'Inactive'}</span>
    </div>
  );
}

function ProTip() {
  return (
    <div className="p-4 bg-blue-50 border border-blue-100 rounded-md">
      <h4 className="text-[10px] font-bold text-blue-700 uppercase tracking-widest mb-2">Pro Tip</h4>
      <p className="text-[10px] text-blue-600 leading-relaxed">Use parent categories to create groups like "Corporate Wear" and sub-categories like "Shirts" for better navigation.</p>
    </div>
  );
}
