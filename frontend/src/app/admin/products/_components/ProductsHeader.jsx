import { Plus, Upload } from "lucide-react";

export default function ProductsHeader({ onAdd, onImport }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">Products</h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Manage your product catalog</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={onImport}
          className="px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded border border-slate-200 text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
        >
          <Upload size={16} /> Bulk Import
        </button>
        <button 
          onClick={onAdd}
          className="bg-blue-600 text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>
    </div>
  );
}
