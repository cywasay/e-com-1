"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQueries } from "@tanstack/react-query";
import { GitCompare, ShoppingBag } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import useCompareStore from "@/store/compareStore";
import StorefrontLayout from "@/components/StorefrontLayout";
import CompareButton from "@/components/CompareButton";
import { getDisplayPrice } from "@/lib/productPrice";
import { getPrimaryImage } from "@/lib/productDisplay";
import StockBadge from "@/components/StockBadge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

function ComparePageInner() {
  const searchParams = useSearchParams();
  const { user } = useAuthStore();
  const storeItems = useCompareStore((state) => state.items);
  const clearAll = useCompareStore((state) => state.clearAll);

  const slugs = useMemo(() => {
    const fromUrl = (searchParams.get("slugs") || "")
      .split(",")
      .map((slug) => slug.trim())
      .filter(Boolean);
    if (fromUrl.length > 0) return fromUrl;
    return storeItems.map((item) => item.slug);
  }, [searchParams, storeItems]);

  const productQueries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: ["public", "product-slug", slug],
      queryFn: async () => {
        const response = await api.get(`/products/slug/${slug}`);
        return response.data.data;
      },
      enabled: !!slug,
    })),
  });

  const products = productQueries
    .map((query) => query.data)
    .filter(Boolean);

  const isLoading = productQueries.some((query) => query.isLoading);
  const attributes = [
    { key: "name", label: "Product" },
    { key: "category", label: "Category" },
    { key: "sku", label: "SKU" },
    { key: "stock", label: "Availability" },
    { key: "price", label: "Price" },
    { key: "description", label: "Description" },
    { key: "actions", label: "Actions" },
  ];

  const getCellValue = (product, key) => {
    const { amount, label } = getDisplayPrice(product, user);
    switch (key) {
      case "name":
        return product.name;
      case "category":
        return product.category?.name || "—";
      case "sku":
        return product.sku || `PRD-${product.id}`;
      case "stock":
        return product.stock_qty;
      case "price":
        return { amount, label };
      case "description":
        return product.description || "—";
      default:
        return null;
    }
  };

  return (
    <StorefrontLayout>
      <section className="border-b border-border bg-white py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-accent">
                <GitCompare size={20} />
                <span className="text-xs font-bold uppercase tracking-widest">Compare</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Product comparison
              </h1>
              <p className="mt-2 text-muted-foreground">
                Compare up to 4 products side by side.
              </p>
            </div>
            {products.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-semibold text-muted-foreground hover:text-foreground"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 py-12 pb-28">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-muted/30 px-6 py-16 text-center text-muted-foreground">
            Loading comparison...
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
            <GitCompare size={40} className="mx-auto mb-4 text-muted-foreground/40" />
            <h2 className="text-lg font-bold text-foreground">No products to compare</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Add products from the catalog using the Compare button.
            </p>
            <Link
              href="/products"
              className={cn(buttonVariants({ variant: "accent", size: "cta" }), "mt-6 inline-flex")}
            >
              Browse catalog
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-border bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[140px] bg-muted/50">Attribute</TableHead>
                  {products.map((product) => {
                    const image = getPrimaryImage(product);
                    return (
                      <TableHead key={product.id} className="min-w-[220px] align-top">
                        <div className="space-y-3 py-2">
                          <div className="flex h-24 items-center justify-center rounded-md border border-border bg-muted p-2">
                            {image ? (
                              <img
                                src={image.full_url}
                                alt={product.name}
                                className="max-h-full max-w-full object-contain"
                              />
                            ) : (
                              <ShoppingBag size={28} className="text-border" />
                            )}
                          </div>
                          <Link
                            href={`/products/${product.slug}`}
                            className="line-clamp-2 text-sm font-bold text-foreground hover:text-accent"
                          >
                            {product.name}
                          </Link>
                        </div>
                      </TableHead>
                    );
                  })}
                </TableRow>
              </TableHeader>
              <TableBody>
                {attributes.map((attribute) => (
                  <TableRow key={attribute.key}>
                    <TableCell className="bg-muted/30 font-semibold text-foreground">
                      {attribute.label}
                    </TableCell>
                    {products.map((product) => {
                      if (attribute.key === "actions") {
                        return (
                          <TableCell key={`${product.id}-actions`}>
                            <div className="flex flex-col gap-2">
                              <Link
                                href={`/products/${product.slug}`}
                                className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full")}
                              >
                                View product
                              </Link>
                              <CompareButton product={product} className="w-full" />
                            </div>
                          </TableCell>
                        );
                      }

                      const value = getCellValue(product, attribute.key);

                      return (
                        <TableCell key={`${product.id}-${attribute.key}`}>
                          {attribute.key === "stock" ? (
                            <StockBadge stockQty={value} />
                          ) : attribute.key === "price" ? (
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                {value.label === "Wholesale" ? "Wholesale" : user ? "Your price" : "List price"}
                              </p>
                              <p className="text-lg font-bold text-foreground">AED {value.amount}</p>
                            </div>
                          ) : attribute.key === "description" ? (
                            <p className="line-clamp-4 text-sm text-muted-foreground">{value}</p>
                          ) : (
                            <span className="text-sm text-foreground">{value}</span>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}

export default function ComparePageClient() {
  return (
    <Suspense fallback={null}>
      <ComparePageInner />
    </Suspense>
  );
}
