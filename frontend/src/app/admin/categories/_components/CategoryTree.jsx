"use client";
import { FolderTree } from "lucide-react";
import CategoryItem from "./CategoryItem";

export default function CategoryTree({ categories, isLoading, onEdit, onDelete, editingId }) {
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
          <FolderTree size={14} /> Category Structure
        </h3>
      </div>
      <div className="p-6">
        {isLoading ? <LoadingSkeleton /> : categories.length === 0 ? <EmptyState /> : (
          <div className="space-y-2">
            {categories.map(category => (
              <CategoryItem key={category.id} category={category} onEdit={onEdit} onDelete={onDelete} editingId={editingId} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse flex items-center gap-3 p-3 rounded-md border border-slate-100">
          <div className="w-4 h-4 bg-slate-100 rounded" />
          <div className="flex-1 space-y-2"><div className="h-4 w-32 bg-slate-100 rounded" /><div className="h-2 w-24 bg-slate-100 rounded" /></div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-lg"><p className="text-sm text-slate-400">No categories found. Start by creating one.</p></div>;
}
