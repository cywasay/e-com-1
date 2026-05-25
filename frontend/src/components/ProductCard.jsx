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

export default function ProductCard({
  product,
  user: userProp,
  showDescription = true,
  className = "",
}) {
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
        "group h-full gap-0 overflow-hidden py-0 transition-colors hover:border-accent",
        className
      )}
    >
      <Link
        href={`/products/${product.slug}`}
        className="relative flex aspect-[5/4] items-center justify-center border-b border-border bg-muted p-5"
      >
        {primaryImage ? (
          <img
            src={primaryImage.full_url}
            alt={product.name}
            className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <ShoppingBag size={36} strokeWidth={1} className="text-border" />
        )}

        {product.is_featured && (
          <Badge variant="accent" className="absolute top-3 left-3 text-[9px] uppercase tracking-widest">
            Featured
          </Badge>
        )}
      </Link>

      <CardContent className="flex flex-1 flex-col p-5">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {category}
          </span>

          <h3 className="text-base font-bold leading-snug text-foreground">
            <Link
              href={`/products/${product.slug}`}
              className="line-clamp-2 hover:text-accent transition-colors"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        {showDescription && product.description && (
          <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
            {product.description}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <span>
            <span className="font-bold uppercase tracking-wide text-foreground/70">SKU</span>{" "}
            {sku}
          </span>
          <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
          <StockBadge stockQty={product.stock_qty} className="!mt-0" />
          <MoqBadge product={product} />
        </div>

        <div className="mt-5 flex flex-1 flex-col justify-end border-t border-border pt-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {priceLabel}
          </p>
          <div className="mt-1.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
            {label === "Wholesale" && (
              <span className="text-[10px] font-bold uppercase tracking-widest text-accent">
                From
              </span>
            )}
            <span className="text-xl font-bold text-foreground">AED {amount}</span>
            <span className="text-xs text-muted-foreground">/each</span>
          </div>
          {compareAt && (
            <p className="mt-1 text-xs text-muted-foreground line-through">
              AED {compareAt}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Link
              href={`/products/${product.slug}`}
              className={cn(
                buttonVariants({ variant: "default", size: "sm" }),
                "h-10 text-[10px] uppercase tracking-widest"
              )}
            >
              View
              <ArrowRight size={12} />
            </Link>
            <AddToQuoteButton product={product} className="h-10 w-full" label="Quote" />
          </div>
          <CompareButton product={product} className="mt-2.5 w-full" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductCardSkeleton({ className = "" }) {
  return (
    <Card className={cn("h-full gap-0 overflow-hidden py-0", className)}>
      <Skeleton className="aspect-[5/4] w-full rounded-none" />
      <CardContent className="flex flex-1 flex-col p-5">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="mt-2 h-5 w-4/5" />
        <Skeleton className="mt-3 h-3 w-full" />
        <Skeleton className="mt-4 h-3 w-28" />
        <div className="mt-5 space-y-2 border-t border-border pt-5">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-7 w-32" />
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <Skeleton className="h-10 rounded-md" />
            <Skeleton className="h-10 rounded-md" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
