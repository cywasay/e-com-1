"use client";

import { Package, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function OrderHistoryItem({ order }) {
  const getStatusVariant = (s) => {
    switch (s) {
      case "pending":
        return "outline";
      case "processing":
        return "secondary";
      case "shipped":
        return "secondary";
      case "delivered":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusClass = (s) => {
    switch (s) {
      case "pending":
        return "border-amber-200 bg-amber-50 text-amber-600";
      case "processing":
        return "border-blue-200 bg-blue-50 text-blue-600";
      case "shipped":
        return "border-purple-200 bg-purple-50 text-purple-600";
      case "delivered":
        return "border-green-200 bg-green-50 text-green-600";
      case "cancelled":
        return "";
      default:
        return "";
    }
  };

  return (
    <Card className="group transition-colors hover:border-accent">
      <CardContent className="flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted text-foreground transition-colors group-hover:bg-accent group-hover:text-white">
            <Package size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-foreground">Order #{order.id}</span>
              <Badge variant={getStatusVariant(order.status)} className={`text-[10px] uppercase tracking-wider ${getStatusClass(order.status)}`}>
                {order.status}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-4 text-[13px] font-medium text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Clock size={14} /> {new Date(order.created_at).toLocaleDateString()}
              </span>
              <span>•</span>
              <span>{order.items_count || 0} items</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-10 md:justify-end">
          <div className="text-right">
            <p className="mb-0.5 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">Amount Paid</p>
            <p className="text-[16px] font-black text-foreground">AED {order.total_amount}</p>
          </div>

          <Link
            href={`/account/orders/${order.id}`}
            className={cn(buttonVariants({ variant: "outline", size: "icon" }), "rounded-full")}
            aria-label={`View order #${order.id}`}
          >
            <ChevronRight size={18} />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
