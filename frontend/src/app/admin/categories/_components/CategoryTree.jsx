"use client";
import { FolderTree } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import CategoryItem from "./CategoryItem";

export default function CategoryTree({ categories, isLoading, onEdit, onDelete, editingId }) {
  return (
    <div className="bg-white border border-border rounded-md shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-muted flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
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
    <div className="space-y-3">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 rounded-md border border-border p-3">
          <Skeleton className="h-4 w-4 shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return <div className="text-center py-12 border-2 border-dashed border-border rounded-lg"><p className="text-sm text-muted-foreground">No categories found. Start by creating one.</p></div>;
}
