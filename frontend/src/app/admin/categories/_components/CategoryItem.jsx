"use client";
import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";

export default function CategoryItem({ category, depth = 0, onEdit, onDelete, editingId }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = category.children_recursive && category.children_recursive.length > 0;

  return (
    <div className="space-y-1">
      <div 
        className={`flex items-center gap-3 p-3 rounded-md border transition-all ${
          editingId === category.id ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 hover:border-slate-300'
        }`}
        style={{ marginLeft: `${depth * 24}px` }}
      >
        <button onClick={() => setIsOpen(!isOpen)} className={`p-0.5 rounded hover:bg-slate-100 transition-colors ${!hasChildren && 'invisible'}`}>
          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-900 truncate">{category.name}</span>
            {!category.is_active && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-slate-100 text-slate-500 uppercase tracking-wider">Hidden</span>}
          </div>
          <div className="text-[10px] text-slate-400 font-mono truncate">{category.slug}</div>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onEdit(category)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Pencil size={14} /></button>
          {!hasChildren && <button onClick={() => onDelete(category.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>}
        </div>
      </div>
      {isOpen && hasChildren && (
        <div className="space-y-1">
          {category.children_recursive.map(child => (
            <CategoryItem key={child.id} category={child} depth={depth + 1} onEdit={onEdit} onDelete={onDelete} editingId={editingId} />
          ))}
        </div>
      )}
    </div>
  );
}
