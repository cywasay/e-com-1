"use client";

import { Loader2, ArrowRight, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderSummary({ items, total, isPending }) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 max-h-[400px] space-y-4 overflow-y-auto pr-2">
          {items.map((item) => (
            <div key={`${item.product_id}-${item.variant_id}`} className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="line-clamp-1 text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="text-sm font-semibold">AED {(item.price * item.quantity).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="mb-6 space-y-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Subtotal</span>
            <span>AED {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Shipping</span>
            <span className="font-medium text-[#2d7a4f]">Free</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-lg font-bold">
            <span>Total</span>
            <span>AED {total.toLocaleString()}</span>
          </div>
        </div>
        <Button
          type="submit"
          form="checkout-form"
          variant="accent"
          size="cta"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? (
            <>
              <Loader2 size={20} className="animate-spin" /> Processing...
            </>
          ) : (
            <>
              <ArrowRight size={20} /> Place Order
            </>
          )}
        </Button>
        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <CreditCard size={12} />
          <span>Secure payment powered by Stripe</span>
        </div>
      </CardContent>
    </Card>
  );
}
