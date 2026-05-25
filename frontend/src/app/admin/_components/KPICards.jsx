"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ShoppingCart, DollarSign, Package, Users, UserCheck, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const KPI_STYLES = [
  { icon: DollarSign, iconClass: "text-emerald-700", bgClass: "bg-emerald-50" },
  { icon: ShoppingCart, iconClass: "text-primary", bgClass: "bg-primary/5" },
  { icon: Package, iconClass: "text-accent", bgClass: "bg-accent/10" },
  { icon: Users, iconClass: "text-primary", bgClass: "bg-primary/5" },
  { icon: UserCheck, iconClass: "text-amber-700", bgClass: "bg-amber-50" },
  { icon: FileText, iconClass: "text-accent", bgClass: "bg-accent/10" },
];

function KPICardShell({ children, highlight, className }) {
  return (
    <Card
      className={cn(
        "h-full transition-colors hover:border-accent/40",
        highlight && "border-amber-300 bg-amber-50/30",
        className
      )}
    >
      <CardContent className="flex h-full min-h-[132px] flex-col gap-4 p-5">
        {children}
      </CardContent>
    </Card>
  );
}

export default function KPICards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((res) => res.data.data),
  });

  const kpis = stats
    ? [
        {
          label: "Total Revenue",
          value: `AED ${stats.total_revenue.toLocaleString()}`,
          ...KPI_STYLES[0],
        },
        {
          label: "Orders Today",
          value: stats.orders_today,
          sub: `Total: ${stats.total_orders}`,
          ...KPI_STYLES[1],
        },
        {
          label: "Active Products",
          value: stats.active_products,
          ...KPI_STYLES[2],
        },
        {
          label: "Total Customers",
          value: stats.total_customers,
          sub: `${stats.b2b_accounts} B2B accounts`,
          ...KPI_STYLES[3],
        },
        {
          label: "B2B Pending",
          value: stats.pending_b2b_applications,
          ...KPI_STYLES[4],
          link: "/admin/b2b-applications",
          highlight: stats.pending_b2b_applications > 0,
        },
        {
          label: "Open Quotes",
          value: stats.pending_quotes ?? 0,
          ...KPI_STYLES[5],
          link: "/admin/quotes",
          highlight: (stats.pending_quotes ?? 0) > 0,
        },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <KPICardShell key={i}>
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="mt-auto space-y-2">
              <Skeleton className="h-2 w-20" />
              <Skeleton className="h-7 w-24" />
            </div>
          </KPICardShell>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        const content = (
          <KPICardShell highlight={kpi.highlight}>
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-lg",
                kpi.bgClass,
                kpi.iconClass
              )}
            >
              <Icon size={20} />
            </div>
            <div className="mt-auto">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {kpi.label}
              </p>
              <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
                {kpi.value}
              </p>
              {kpi.sub ? (
                <p className="mt-1 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {kpi.sub}
                </p>
              ) : (
                <p className="mt-1 text-[10px] opacity-0">.</p>
              )}
            </div>
          </KPICardShell>
        );

        return kpi.link ? (
          <Link key={idx} href={kpi.link} className="block h-full">
            {content}
          </Link>
        ) : (
          <div key={idx} className="h-full">
            {content}
          </div>
        );
      })}
    </div>
  );
}
