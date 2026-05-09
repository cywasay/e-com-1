"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ShoppingCart, DollarSign, Package, Users, UserCheck } from "lucide-react";

export default function KPICards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then(res => res.data.data),
  });

  const kpis = stats ? [
    { label: "Total Revenue", value: `AED ${stats.total_revenue.toLocaleString()}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
    { label: "Orders Today", value: stats.orders_today, sub: `Total: ${stats.total_orders}`, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Active Products", value: stats.active_products, icon: Package, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Customers", value: stats.total_customers, sub: `${stats.b2b_accounts} B2B Accounts`, icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "B2B Applications", value: stats.pending_b2b_applications, icon: UserCheck, color: "text-amber-600", bg: "bg-amber-50", link: "/admin/b2b-applications", highlight: stats.pending_b2b_applications > 0 },
  ] : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="premium-card p-6 rounded-2xl animate-pulse">
            <div className="flex flex-col gap-4">
              <div className="bg-slate-100 w-10 h-10 rounded-xl" />
              <div className="space-y-2">
                <div className="h-2 w-20 bg-slate-100 rounded" />
                <div className="h-6 w-24 bg-slate-100 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {kpis.map((kpi, idx) => {
        const Content = (
          <div className={`premium-card p-6 rounded-2xl ${kpi.highlight ? "ring-2 ring-amber-500 bg-amber-50/20" : ""}`}>
            <div className="flex flex-col gap-4">
              <div className={`${kpi.bg} ${kpi.color} w-10 h-10 rounded-xl flex items-center justify-center shadow-sm`}>
                <kpi.icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{kpi.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                {kpi.sub && <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest">{kpi.sub}</p>}
              </div>
            </div>
          </div>
        );

        return kpi.link ? (
          <Link key={idx} href={kpi.link} className="block transition-transform hover:-translate-y-1">{Content}</Link>
        ) : (
          <div key={idx}>{Content}</div>
        );
      })}
    </div>
  );
}
