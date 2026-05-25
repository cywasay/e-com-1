"use client";

import Link from "next/link";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import StorefrontLayout from "@/components/StorefrontLayout";
import { canUseCart } from "@/lib/userRoles";
import { Trash2 as Trash, Plus as Add, Minus as Sub, ShoppingBag as Bag, FileText } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { user } = useAuthStore();
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();

  if (!canUseCart(user)) {
    return (
      <StorefrontLayout>
        <div className="page-container-narrow py-12">
          <Card>
            <CardContent className="p-16 text-center">
              <FileText className="mx-auto mb-4 text-muted-foreground" size={40} />
              <h1 className="mb-2 text-2xl font-bold">Wholesale accounts use quotes</h1>
              <p className="mb-8 text-muted-foreground">
                B2B buyers request quotes instead of using the cart. Add products to your quote and submit when ready.
              </p>
              <Link href="/quote" className={cn(buttonVariants({ variant: "accent", size: "cta" }))}>
                Go to quote builder
              </Link>
            </CardContent>
          </Card>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="page-container-narrow py-12">
        <h1 className="section-heading mb-8">Your Cart</h1>

        {items.length === 0 ? (
          <Card>
            <CardContent className="p-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-lg bg-muted">
                <Bag className="text-border" size={40} />
              </div>
              <h2 className="mb-2 text-2xl font-bold">Your cart is empty</h2>
              <p className="mb-8 text-muted-foreground">
                Looks like you haven&apos;t added anything to your cart yet.
              </p>
              <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }))}>
                Browse Products
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <div className="space-y-4 lg:col-span-8">
              {items.map((item) => (
                <Card key={`${item.product_id}-${item.variant_id}`}>
                  <CardContent className="flex items-center gap-6 p-4">
                    <div className="h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-border">
                          <Bag size={32} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold">{item.name}</h3>
                      {item.variant_label && (
                        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                          {item.variant_label}
                        </p>
                      )}
                      <p className="pt-1 text-sm font-semibold">AED {item.price}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center rounded-lg border border-border bg-muted px-2 py-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.product_id, item.variant_id, -1)}
                        >
                          <Sub size={14} />
                        </Button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => updateQuantity(item.product_id, item.variant_id, 1)}
                        >
                          <Add size={14} />
                        </Button>
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="sticky top-24 lg:col-span-4">
              <Card>
                <CardContent className="space-y-6 p-8">
                  <h2 className="text-lg font-bold">Order Summary</h2>

                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span className="text-foreground">AED {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span className="text-[#2d7a4f]">Calculated at next step</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-4 text-lg font-bold">
                      <span>Total</span>
                      <span>AED {getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Link
                    href="/checkout"
                    className={cn(buttonVariants({ variant: "accent", size: "cta" }), "w-full")}
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="text-center text-[10px] font-medium text-muted-foreground">
                    Secure checkout powered by Stripe
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
