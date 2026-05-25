"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { ArrowLeft, ShoppingCart, ShoppingBag, Check } from "lucide-react";
import StorefrontLayout from "@/components/StorefrontLayout";
import AddToQuoteButton from "@/components/AddToQuoteButton";
import MoqBadge from "@/components/MoqBadge";
import { getDisplayPrice } from "@/lib/productPrice";
import {
  canUseCart,
  shouldShowAddToCart,
  shouldUseQuotePrimary,
  getProductMoq,
} from "@/lib/userRoles";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";

export default function ProductDetailClient({ slug, initialProduct }) {
  const { user } = useAuthStore();
  const { addItem } = useCartStore();
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ["public", "product", slug],
    queryFn: async () => {
      const response = await api.get(`/products/slug/${slug}`);
      return response.data.data;
    },
    initialData: initialProduct,
    enabled: !!slug,
  });

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAddToCart = () => {
    if (!canUseCart(user)) return;

    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Please select an option first");
      return;
    }

    const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];

    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: primaryImage?.full_url,
      price: product.resolved_price || product.price,
      quantity: moq,
      moq,
      variant_id: selectedVariant?.id || null,
      variant_label: selectedVariant ? Object.values(selectedVariant.options).join(" / ") : null,
    });

    setShowSuccess(true);
  };

  const moq = getProductMoq(product);
  const showCartButton = shouldShowAddToCart(user);
  const quotePrimary = shouldUseQuotePrimary(user);

  if (isLoading && !initialProduct) {
    return (
      <StorefrontLayout>
        <div className="page-container py-12">
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
      </StorefrontLayout>
    );
  }

  if (!product && !isLoading) {
    return (
      <StorefrontLayout>
        <div className="flex flex-col items-center justify-center py-24">
          <ShoppingBag className="mb-4 text-border" size={48} />
          <h1 className="mb-2 text-xl font-bold">Product Not Found</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            The product you are looking for does not exist or has been removed.
          </p>
          <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }))}>
            Back to Catalog
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const primaryImage = product?.images?.find((img) => img.is_primary) || product?.images?.[0];
  const { amount, compareAt, label } = getDisplayPrice(product, user);
  const priceLabel = label || (user ? "Your Price" : "List Price");

  return (
    <StorefrontLayout>
      <div className="border-b border-border bg-white">
        <div className="page-container py-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>
      </div>

      <div className="page-container py-12">
        <Card className="overflow-hidden py-0">
          <div className="grid grid-cols-1 gap-0 md:grid-cols-2 md:divide-x md:divide-border">
            <CardContent className="flex flex-col items-center justify-center bg-muted p-8 md:p-12">
              <div className="mb-6 aspect-[4/5] w-full max-w-md overflow-hidden rounded-lg border border-border bg-white shadow-sm">
                {primaryImage ? (
                  <img src={primaryImage.full_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted text-border">
                    <ShoppingBag size={64} strokeWidth={1} />
                  </div>
                )}
              </div>
              {product?.images?.length > 1 && (
                <div className="flex w-full max-w-md gap-4 overflow-x-auto pb-2">
                  {product.images.map((img) => (
                    <button
                      key={img.id}
                      type="button"
                      className="h-20 w-20 shrink-0 overflow-hidden rounded-md border border-border transition-colors hover:border-accent focus:ring-2 focus:ring-accent focus:outline-none"
                    >
                      <img src={img.full_url} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </CardContent>

            <CardContent className="flex flex-col justify-center p-8 md:p-12">
              <div className="mb-8 space-y-3">
                {product?.category && (
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl leading-tight font-bold tracking-tight text-foreground md:text-4xl">
                  {product?.name}
                </h1>
                <p className="text-sm font-medium text-muted-foreground">
                  SKU: {product?.sku || `PRD-${product?.id}`}
                </p>
              </div>

              <div className="-mx-8 mb-8 border-y border-border bg-muted px-8 py-6 md:-mx-12 md:px-12">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{priceLabel}</p>
                  <div className="flex items-end gap-3">
                    <span className="text-4xl font-bold tracking-tight">AED {amount}</span>
                    {compareAt && (
                      <span className="mb-1 text-sm text-muted-foreground line-through">AED {compareAt}</span>
                    )}
                  </div>
                  {!user && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      <Link href="/login" className="font-semibold text-accent hover:underline">Sign in</Link>
                      {" "}for wholesale pricing or{" "}
                      <Link href="/wholesale" className="font-semibold text-accent hover:underline">apply for a B2B account</Link>.
                    </p>
                  )}
                  {product?.stock_qty > 0 ? (
                    <Badge variant="outline" className="mt-2 border-[#2d7a4f]/20 bg-[#2d7a4f]/10 text-[#2d7a4f]">
                      <Check size={14} /> In stock and ready to ship
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="mt-2">Currently out of stock</Badge>
                  )}
                  {moq && (
                    <div className="mt-2">
                      <MoqBadge product={product} />
                    </div>
                  )}
                </div>
              </div>

              {product?.variants?.length > 0 && (
                <div className="mb-8 space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Select Option</h3>
                  <ToggleGroup
                    type="single"
                    value={selectedVariant?.id?.toString() || ""}
                    onValueChange={(value) => {
                      const variant = product.variants.find((v) => v.id.toString() === value);
                      setSelectedVariant(variant || null);
                    }}
                    variant="outline"
                    spacing={2}
                    className="flex flex-wrap justify-start"
                  >
                    {product.variants.map((variant) => (
                      <ToggleGroupItem
                        key={variant.id}
                        value={variant.id.toString()}
                        className="px-4 py-2 text-sm font-medium data-pressed:border-accent data-pressed:bg-accent/10 data-pressed:text-accent"
                      >
                        {Object.values(variant.options).join(" / ")}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </div>
              )}

              <div className="mb-8 space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-foreground">Description</h3>
                <div className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">
                  {product?.description || "No detailed description provided for this product."}
                </div>
              </div>

              <div className="relative mt-auto space-y-3 border-t border-border pt-4">
                {showSuccess && (
                  <div className="absolute -top-14 right-0 left-0 flex animate-in justify-center fade-in slide-in-from-bottom-2 duration-300">
                    <Badge className="gap-2 bg-primary px-4 py-2 text-primary-foreground shadow-lg">
                      <Check size={14} className="text-[#2d7a4f]" /> Added to cart successfully
                    </Badge>
                  </div>
                )}

                {quotePrimary ? (
                  <AddToQuoteButton
                    product={product}
                    variant={selectedVariant}
                    className="h-10 w-full"
                    size="default"
                    label="Add to quote"
                  />
                ) : null}

                {showCartButton && (
                  <Button
                    onClick={handleAddToCart}
                    disabled={product?.stock_qty <= 0}
                    variant={showSuccess ? "default" : quotePrimary ? "outline" : "accent"}
                    size="cta"
                    className="w-full"
                  >
                    {showSuccess ? <Check size={18} /> : <ShoppingCart size={18} />}
                    {showSuccess ? "Success" : product?.stock_qty <= 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                )}

                {!quotePrimary && (
                  <AddToQuoteButton
                    product={product}
                    variant={selectedVariant}
                    className="h-10 w-full"
                    label="Request quote"
                  />
                )}

                {!user && (
                  <p className="text-center text-xs font-medium text-muted-foreground">
                    Guest checkout available.{" "}
                    <Link href="/login" className="text-accent hover:underline">Sign in</Link>
                    {" "}for wholesale pricing.
                  </p>
                )}
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </StorefrontLayout>
  );
}
