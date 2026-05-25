"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Loader2, Package } from "lucide-react";
import { use } from "react";
import api from "@/lib/api";
import AccountPageHeader from "../../_components/AccountPageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function formatAddress(address) {
  if (!address) return "No shipping address on file";
  if (typeof address === "string") return address;

  const lines = [
    address.full_name,
    address.address_line_1,
    address.address_line_2,
    [address.city, address.emirates].filter(Boolean).join(", "),
    address.country,
    address.phone ? `Phone: ${address.phone}` : null,
  ].filter(Boolean);

  return lines.join("\n");
}

function statusClass(status) {
  switch (status) {
    case "pending":
      return "border-amber-200 bg-amber-50 text-amber-600";
    case "processing":
      return "border-blue-200 bg-blue-50 text-blue-600";
    case "shipped":
      return "border-purple-200 bg-purple-50 text-purple-600";
    case "delivered":
      return "border-green-200 bg-green-50 text-green-600";
    default:
      return "";
  }
}

export default function OrderDetailClient({ params }) {
  const { id } = use(params);

  const { data: order, isLoading, isError } = useQuery({
    queryKey: ["my-order", id],
    queryFn: () => api.get(`/orders/${id}`).then((res) => res.data.data),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className="space-y-6 py-12 text-center">
        <p className="text-muted-foreground">Order not found or you do not have access.</p>
        <Link href="/account/orders" className={cn(buttonVariants({ variant: "outline" }))}>
          Back to orders
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-accent"
      >
        <ArrowLeft size={16} />
        Back to order history
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <AccountPageHeader
          title={`Order #${order.id}`}
          description={`Placed on ${new Date(order.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}`}
        />
        <Badge variant="outline" className={cn("uppercase tracking-widest text-[10px]", statusClass(order.status))}>
          {order.status}
        </Badge>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Package size={22} />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Order total</p>
              <p className="text-2xl font-black text-foreground">AED {order.total_amount}</p>
            </div>
          </div>
          {order.tracking_number && (
            <div className="text-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Tracking</p>
              <p className="font-semibold text-foreground">
                {order.carrier ? `${order.carrier}: ` : ""}
                {order.tracking_number}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Shipping address</p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
              {formatAddress(order.shipping_address)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-2 p-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Buyer type</p>
            <p className="text-sm font-semibold uppercase text-foreground">{order.buyer_type || "b2c"}</p>
            {order.notes && (
              <>
                <p className="pt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Notes</p>
                <p className="text-sm text-muted-foreground">{order.notes}</p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-muted-foreground">
          <Package size={14} />
          Items
        </h3>
        <Card className="overflow-hidden py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-center">Qty</TableHead>
                <TableHead className="text-right">Unit price</TableHead>
                <TableHead className="text-right">Line total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-semibold text-foreground">{item.product?.name || "Product"}</p>
                    {item.variant && (
                      <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                        {item.variant.label || item.variant.sku || "Variant"}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-semibold">{item.quantity}</TableCell>
                  <TableCell className="text-right">AED {item.unit_price_snapshot}</TableCell>
                  <TableCell className="text-right font-semibold">AED {item.line_total}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="text-right text-[10px] font-bold uppercase tracking-widest">
                  Total
                </TableCell>
                <TableCell className="text-right text-lg font-black text-accent">AED {order.total_amount}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>
      </div>
    </div>
  );
}
