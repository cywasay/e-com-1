"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";

export default function RecentOrders() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then(res => res.data.data),
  });

  const getStatusColor = (s) => {
    switch (s) {
      case 'pending': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'processing': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'shipped': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'delivered': return "bg-green-50 text-green-700 border-green-200";
      case 'cancelled': return "bg-red-50 text-red-700 border-red-200";
      case 'refunded': return "bg-slate-50 text-slate-700 border-slate-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="lg:col-span-2 premium-card rounded-2xl overflow-hidden flex flex-col">
      <div className="px-8 py-5 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-blue-600" />
          <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em]">Recent Orders</h3>
        </div>
        <Link href="/admin/orders" className="text-[10px] font-black text-blue-600 hover:text-slate-900 uppercase tracking-widest flex items-center gap-1 group">
          View All <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
      <div className="overflow-x-auto flex-1">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-white text-slate-400 border-b border-slate-50">
            <tr>
              <th className="px-8 py-5 font-black uppercase text-[9px] tracking-widest">Order ID</th>
              <th className="px-8 py-5 font-black uppercase text-[9px] tracking-widest">Customer</th>
              <th className="px-8 py-5 font-black uppercase text-[9px] tracking-widest">Status</th>
              <th className="px-8 py-5 font-black uppercase text-[9px] tracking-widest text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50/50">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="px-8 py-5"><div className="h-4 w-12 bg-slate-50 rounded" /></td>
                  <td className="px-8 py-5"><div className="h-4 w-24 bg-slate-50 rounded" /></td>
                  <td className="px-8 py-5"><div className="h-5 w-20 bg-slate-50 rounded-full" /></td>
                  <td className="px-8 py-5 text-right"><div className="h-4 w-16 bg-slate-50 rounded ml-auto" /></td>
                </tr>
              ))
            ) : stats?.recent_orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors duration-150 group">
                <td className="px-8 py-5">
                  <Link href={`/admin/orders?id=${order.id}`} className="font-black text-slate-900 hover:text-blue-600 flex items-center gap-2">
                    #{order.id}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity"><ChevronRight size={12} /></div>
                  </Link>
                  <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">{new Date(order.created_at).toLocaleDateString()}</p>
                </td>
                <td className="px-8 py-5 text-slate-600 font-bold text-xs">{order.customer?.name || "Guest User"}</td>
                <td className="px-8 py-5">
                  <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border shadow-sm ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-8 py-5 font-black text-slate-900 text-xs text-right">AED {order.total_amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
