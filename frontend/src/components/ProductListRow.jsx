"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import useAuthStore from "@/store/authStore";
import { getDisplayPrice } from "@/lib/productPrice";
import {
  formatProductLabel,
  getPriceLabel,
  getPrimaryImage,
} from "@/lib/productDisplay";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import StockBadge from "./StockBadge";
import CompareButton from "./CompareButton";
import AddToQuoteButton from "./AddToQuoteButton";
import MoqBadge from "./MoqBadge";

export default function ProductListRow({ product, user: userProp, className = "" }) {
  const authUser = useAuthStore((state) => state.user);
  const user = userProp !== undefined ? userProp : authUser;

  const primaryImage = getPrimaryImage(product);
  const { amount, compareAt, label } = getDisplayPrice(product, user);
  const sku = product?.sku || `PRD-${product?.id}`;
  const category = formatProductLabel(product.category?.name) || "General";
  const priceLabel = getPriceLabel(user, label);

  return (
    <Card
      className={cn(
        "group gap-0 overflow-hidden py-0 transition-colors hover:border-accent",
        className
      )}
    >
      <CardContent className="flex flex-col gap-4 p-4 md:flex-row md:items-center md:gap-5 lg:p-5">
        <Link
          href={`/products/${product.slug}`}
          className="flex h-20 w-20 shrink-0 items-center justify-center self-start rounded-md border border-border bg-muted p-2 md:h-24 md:w-24"
        >
          {primaryImage ? (
            <img
              src={primaryImage.full_url}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <ShoppingBag size={28} strokeWidth={1} className="text-border" />
          )}
        </Link>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {category}
            </span>
            {product.is_featured && (
              <Badge variant="accent" className="text-[9px] uppercase tracking-widest">
                Featured
              </Badge>
            )}
          </div>

          <h3 className="mt-1 text-base font-bold leading-snug text-foreground md:text-lg">
            <Link
              href={`/products/${product.slug}`}
              className="hover:text-accent transition-colors"
            >
              {product.name}
            </Link>
          </h3>

          {product.description && (
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>
          )}

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span>
              <span className="font-bold uppercase tracking-wide text-foreground/70">SKU</span>{" "}
              {sku}
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <StockBadge stockQty={product.stock_qty} className="!mt-0" />
            <MoqBadge product={product} />
          </div>
        </div>

        <div className="flex items-end justify-between gap-4 border-t border-border pt-4 md:w-44 md:shrink-0 md:flex-col md:items-end md:border-t-0 md:pt-0 lg:w-48">
          <div className="text-left md:text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              {priceLabel}
            </p>
            <div className="mt-0.5 flex flex-wrap items-baseline gap-x-1.5 gap-y-0 md:justify-end">
              {label === "Wholesale" && (
                <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                  From
                </span>
              )}
              <span className="text-xl font-bold text-foreground md:text-2xl">AED {amount}</span>
              <span className="text-xs text-muted-foreground">/each</span>
            </div>
            {compareAt && (
              <p className="mt-0.5 text-xs text-muted-foreground line-through md:text-right">
                AED {compareAt}
              </p>
            )}
          </div>

          <div className="flex shrink-0 flex-col items-stretch gap-2 md:w-full md:max-w-[220px] md:items-end">
            <div className="flex items-center gap-2 md:justify-end">
              <Link
                href={`/products/${product.slug}`}
                className={cn(
                  buttonVariants({ variant: "default", size: "sm" }),
                  "h-9 text-[11px] uppercase tracking-widest"
                )}
              >
                View
                <ArrowRight size={13} />
              </Link>
              <AddToQuoteButton product={product} label="Quote" />
            </div>
            <CompareButton product={product} className="md:ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductListRowSkeleton({ className = "" }) {
  return (
    <Card className={cn("gap-0 overflow-hidden py-0", className)}>
      <CardContent className="flex flex-col gap-4 p-4 lg:p-5 md:flex-row md:items-center md:gap-5">
        <Skeleton className="h-20 w-20 shrink-0 rounded-md md:h-24 md:w-24" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-2.5 w-20" />
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-28" />
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-border pt-4 md:w-44 md:flex-col md:items-end md:border-t-0 md:pt-0">
          <div className="space-y-2">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-7 w-28" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-16 rounded-md" />
            <Skeleton className="h-9 w-16 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
