"use client";
import StatusBadge from "./StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AdminTableSkeleton from "../../_components/skeletons/AdminTableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrdersTable({ orders, isLoading, onSelectOrder }) {
  if (isLoading) return <AdminTableSkeleton rows={6} columns={7} />;
  if (orders?.length === 0) {
    return (
      <Card className="py-20 text-center text-gray-400 italic shadow-sm">
        No orders yet.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Order ID</TableHead>
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Customer</TableHead>
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Type</TableHead>
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Items</TableHead>
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Total</TableHead>
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500">Status</TableHead>
            <TableHead className="font-bold uppercase text-[10px] tracking-widest text-gray-500 text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} onClick={() => onSelectOrder(order.id)} className="cursor-pointer">
              <TableCell className="font-black text-foreground">#{order.id}</TableCell>
              <TableCell>
                <div className="font-bold text-gray-700">{order.customer.name}</div>
                <div className="text-[10px] text-gray-400">{order.customer.email}</div>
              </TableCell>
              <TableCell className="text-[10px] font-black uppercase tracking-widest">
                {order.buyer_type === "b2b" ? (
                  <Badge variant="secondary" className="text-accent">Wholesale</Badge>
                ) : (
                  <Badge variant="outline">Retail</Badge>
                )}
              </TableCell>
              <TableCell className="text-gray-600">{order.items?.length || 0} items</TableCell>
              <TableCell className="font-black text-foreground">AED {order.total_amount}</TableCell>
              <TableCell><StatusBadge status={order.status} /></TableCell>
              <TableCell className="text-right text-[10px] text-gray-400 font-bold">
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
