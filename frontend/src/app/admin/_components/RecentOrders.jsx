"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Clock, ChevronRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecentOrders() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((res) => res.data.data),
  });

  const getStatusVariant = (s) => {
    switch (s) {
      case "pending":
        return "outline";
      case "processing":
        return "secondary";
      case "shipped":
        return "secondary";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <Card className="flex h-full min-h-[420px] flex-col py-0">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <Clock size={16} className="text-accent" />
          Recent orders
        </CardTitle>
        <Link
          href="/admin/orders"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          View all
          <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="ml-auto h-4 w-16" />
                  </TableCell>
                </TableRow>
              ))
            ) : stats?.recent_orders?.length ? (
              stats.recent_orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <Link
                      href={`/admin/orders?id=${order.id}`}
                      className="font-semibold text-foreground hover:text-accent"
                    >
                      #{order.id}
                    </Link>
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.customer?.name || "Guest"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)} className="uppercase text-[10px]">
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    AED {order.total_amount.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-sm text-muted-foreground">
                  No orders yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        </div>
      </CardContent>
      <CardFooter className="mt-auto shrink-0 border-t bg-muted/30 p-4">
        <Link href="/admin/orders" className="w-full">
          <Button variant="default" className="w-full">
            Manage orders
            <ArrowUpRight size={14} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
