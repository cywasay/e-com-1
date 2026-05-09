"use client";
import { ChevronRight } from "lucide-react";

export default function PriceSetList({ priceSets, isLoading, selectedSetId, onSelect }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Price Sets</h4>
      <div className="bg-white border border-gray-200 rounded-sm shadow-sm divide-y divide-gray-100">
        {isLoading ? <LoadingSkeleton /> : priceSets?.map((set) => (
          <button
            key={set.id} onClick={() => onSelect(set.id)}
            className={`w-full text-left p-4 hover:bg-gray-50 transition-all flex items-center justify-between group ${selectedSetId === set.id ? "bg-blue-50/50 border-l-2 border-blue-600" : ""}`}
          >
            <div>
              <p className="text-sm font-bold text-gray-900">{set.name}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-sm border ${set.type === 'global_sale' ? "bg-purple-50 text-purple-600 border-purple-100" : "bg-blue-50 text-blue-600 border-blue-100"}`}>{set.type.replace('_', ' ')}</span>
                <span className="text-[10px] text-gray-400 font-medium">{set.items_count} items</span>
              </div>
            </div>
            <ChevronRight size={14} className={`transition-transform ${selectedSetId === set.id ? "translate-x-1 text-blue-600" : "text-gray-300 group-hover:translate-x-1"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return [...Array(3)].map((_, i) => (
    <div key={i} className="p-4 animate-pulse"><div className="h-4 w-32 bg-gray-100 rounded mb-2" /><div className="h-3 w-24 bg-gray-100 rounded" /></div>
  ));
}
