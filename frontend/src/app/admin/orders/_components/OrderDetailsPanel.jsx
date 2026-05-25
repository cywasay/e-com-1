"use client";
import { useState, useEffect } from "react";
import { Package, User, MapPin, ShoppingBag, Truck } from "lucide-react";
import AdminPanelSkeleton from "../../_components/skeletons/AdminPanelSkeleton";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function OrderDetailsPanel({ orderId, onClose, orderDetail, isLoading, onUpdateStatus, isUpdating }) {
  return (
    <Sheet open={!!orderId} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full max-w-2xl sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="border-b bg-muted/30 p-6">
          <SheetTitle className="text-lg font-black text-foreground">Order #{orderId}</SheetTitle>
          <SheetDescription className="text-[10px] font-bold uppercase tracking-widest">
            Order Details & Fulfillment
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {isLoading ? (
            <AdminPanelSkeleton sections={2} />
          ) : orderDetail && (
            <>
              <StatusCard orderDetail={orderDetail} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <CustomerInfo customer={orderDetail.customer} buyerType={orderDetail.buyer_type} />
                <ShippingInfo address={orderDetail.shipping_address} />
              </div>
              <OrderItems items={orderDetail.items} total={orderDetail.total_amount} />
              <FulfillmentForm orderDetail={orderDetail} onUpdate={onUpdateStatus} isUpdating={isUpdating} />
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function StatusCard({ orderDetail }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-accent/10 text-accent rounded-full flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Current Status</p>
            <StatusBadge status={orderDetail.status} />
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Payment ID</p>
          <p className="font-mono text-xs">{orderDetail.stripe_payment_intent || "N/A"}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerInfo({ customer, buyerType }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <User size={12} /> Customer Info
      </h4>
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-3">
          <div><p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Name</p><p className="text-sm font-bold">{customer.name}</p></div>
          <div><p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Email</p><p className="text-sm font-bold">{customer.email}</p></div>
          <div><p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Type</p><p className="text-xs font-bold uppercase">{buyerType}</p></div>
        </CardContent>
      </Card>
    </div>
  );
}

function ShippingInfo({ address }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <MapPin size={12} /> Shipping Address
      </h4>
      <Card className="shadow-sm">
        <CardContent className="p-4">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
            {address ? (typeof address === "string" ? address : JSON.stringify(address, null, 2)) : "No address provided"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function OrderItems({ items, total }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <ShoppingBag size={12} /> Order Items
      </h4>
      <Card className="overflow-hidden py-0 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-bold uppercase tracking-widest text-xs">Product</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-xs text-center">Qty</TableHead>
              <TableHead className="font-bold uppercase tracking-widest text-xs text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-bold text-foreground">{item.product.name}</p>
                  {item.variant && <p className="text-[9px] text-muted-foreground uppercase font-black">{item.variant.label || "Default"}</p>}
                </TableCell>
                <TableCell className="text-center font-bold">{item.quantity}</TableCell>
                <TableCell className="text-right font-black">AED {item.unit_price_snapshot}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2} className="text-right text-[10px] font-black uppercase tracking-widest">Total Amount</TableCell>
              <TableCell className="text-right text-lg font-black text-accent">AED {total}</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </Card>
    </div>
  );
}

function FulfillmentForm({ orderDetail, onUpdate, isUpdating }) {
  const [status, setStatus] = useState(orderDetail.status);

  useEffect(() => {
    setStatus(orderDetail.status);
  }, [orderDetail.status]);

  return (
    <div className="space-y-4 pt-4 border-t border-gray-100">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Truck size={12} /> Fulfillment
      </h4>
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              onUpdate({ status, tracking_number: fd.get("tracking_number"), carrier: fd.get("carrier") });
            }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="refunded">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Tracking #</Label>
                <Input name="tracking_number" defaultValue={orderDetail.tracking_number} placeholder="#7721..." />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Carrier</Label>
                <Input name="carrier" defaultValue={orderDetail.carrier} placeholder="Aramex" />
              </div>
            </div>
            <Button type="submit" disabled={isUpdating} className="w-full uppercase tracking-widest h-auto py-4">
              {isUpdating ? <Loader2 className="animate-spin" /> : "Update Fulfillment"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
