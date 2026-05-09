import { Plus } from "lucide-react";

export default function CaseStudiesHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Case Studies</h1>
        <p className="text-sm text-slate-500">Showcase your success stories and industry expertise.</p>
      </div>
      <button 
        onClick={onAdd}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm"
      >
        <Plus size={18} />
        Add Case Study
      </button>
    </div>
  );
}
