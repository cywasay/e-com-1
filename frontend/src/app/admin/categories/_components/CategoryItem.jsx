"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CategoryItem({ category, depth = 0, onEdit, onDelete, editingId }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children_recursive && category.children_recursive.length > 0;

  return (
    <div className="space-y-1">
      <div 
        className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
          editingId === category.id ? "bg-accent/10 border-accent/30" : "bg-white border-border hover:border-border"
        }`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={() => setIsOpen(!isOpen)}
          className={!hasChildren ? "invisible" : ""}
        >
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-foreground truncate">{category.name}</span>
            {!category.is_active && (
              <Badge variant="outline" className="text-[9px] uppercase tracking-wider">Hidden</Badge>
            )}
          </div>
          <div className="text-[10px] text-muted-foreground font-mono truncate">{category.slug}</div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(category)}>
            <Pencil size={14} />
          </Button>
          {!hasChildren && (
            <Button variant="ghost" size="icon-sm" onClick={() => onDelete(category.id)} className="hover:text-red-600">
              <Trash2 size={14} />
            </Button>
          )}
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="space-y-1">
          {category.children_recursive.map((child) => (
            <CategoryItem key={child.id} category={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} editingId={editingId} />
          ))}
        </div>
      )}
    </div>
  );
}
