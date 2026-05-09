"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

export default function InventoryAlerts() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then(res => res.data.data),
  });

  return (
    <div className="premium-card rounded-2xl flex flex-col">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle size={16} />
          <h3 className="text-[11px] font-black uppercase tracking-[0.2em]">Inventory Alerts</h3>
        </div>
      </div>
      <div className="p-8 space-y-6 flex-1">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between animate-pulse">
              <div className="space-y-2">
                <div className="h-3 w-32 bg-slate-50 rounded" />
                <div className="h-2 w-16 bg-slate-50 rounded" />
              </div>
              <div className="text-right space-y-1">
                <div className="h-4 w-8 bg-slate-50 rounded ml-auto" />
              </div>
            </div>
          ))
        ) : stats?.low_stock_products.length > 0 ? (
          stats.low_stock_products.map((p, i) => (
            <div key={i} className="flex items-center justify-between group">
              <div className="space-y-1">
                <Link href={`/admin/products`} className="text-xs font-bold text-slate-900 hover:text-blue-600 block leading-tight">
                  {p.product_name}
                </Link>
                <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{p.sku}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-red-600">{p.stock_qty}</p>
                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest">Left</p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center py-10 opacity-30">
            <CheckCircle2 size={40} className="text-green-600 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">Inventory healthy</p>
          </div>
        )}
      </div>
      <div className="p-8 bg-slate-50/50 border-t border-slate-50 rounded-b-2xl">
        <Link href="/admin/products" className="w-full bg-slate-900 text-white text-[10px] font-black uppercase tracking-[0.2em] py-4 rounded-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-sm active:scale-95">
          Manage Stock <ArrowUpRight size={14} />
        </Link>
      </div>
    </div>
  );
}

function ArrowUpRight({ size, className }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" 
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" 
      className={className}
    >
      <path d="M7 7h10v10"/><path d="M7 17L17 7"/>
    </svg>
  );
}
