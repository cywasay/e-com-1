"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function InventoryAlerts() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((res) => res.data.data),
  });

  return (
    <Card className="flex h-full min-h-[420px] flex-col py-0">
      <CardHeader className="shrink-0 border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-destructive">
          <AlertTriangle size={16} />
          Low stock
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 space-y-4 p-6">
        {isLoading ? (
          [...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-32" />
                <Skeleton className="h-2 w-16" />
              </div>
              <Skeleton className="h-4 w-8" />
            </div>
          ))
        ) : stats?.low_stock_products?.length > 0 ? (
          stats.low_stock_products.map((p, i) => (
            <div key={i} className="flex items-start justify-between gap-4 border-b border-border pb-4 last:border-0 last:pb-0">
              <div className="min-w-0">
                <Link
                  href="/admin/products"
                  className="text-sm font-semibold text-foreground hover:text-accent line-clamp-1"
                >
                  {p.product_name}
                </Link>
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mt-0.5">
                  SKU {p.sku}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-bold text-destructive">{p.stock_qty}</p>
                <p className="text-[10px] uppercase text-muted-foreground">left</p>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
            <CheckCircle2 size={36} className="mb-3 text-emerald-600 opacity-80" />
            <p className="text-sm font-medium">Inventory levels look healthy</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="mt-auto shrink-0 border-t bg-muted/30 p-4">
        <Link href="/admin/products" className="w-full">
          <Button variant="default" className="w-full">
            Manage products
            <ArrowUpRight size={14} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
