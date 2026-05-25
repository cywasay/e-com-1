"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronRight } from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import StorefrontLayout from "@/components/StorefrontLayout";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function CategoryHubClient({ slug, initialData, notFound = false }) {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["public", "category-hub", slug],
    queryFn: async () => {
      const response = await api.get(`/categories/${slug}`);
      return response.data.data;
    },
    initialData: initialData || undefined,
    enabled: !notFound,
  });

  if (notFound) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-2xl font-bold text-foreground">Category not found</h1>
          <p className="mt-2 text-muted-foreground">This category may have been removed or is unavailable.</p>
          <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }), "mt-6 inline-flex")}>
            Browse catalog
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  const category = data?.category;
  const subcategories = data?.subcategories || [];
  const featuredProducts = data?.featured_products || [];
  const productCount = data?.product_count || 0;

  return (
    <StorefrontLayout>
      <section className="border-b border-white/10 bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-7xl px-6">
          <nav className="mb-4 flex flex-wrap items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-accent">Home</Link>
            <ChevronRight size={14} />
            <Link href="/products" className="hover:text-accent">Products</Link>
            {category?.parent && (
              <>
                <ChevronRight size={14} />
                <Link href={`/categories/${category.parent.slug}`} className="hover:text-accent">
                  {category.parent.name}
                </Link>
              </>
            )}
            <ChevronRight size={14} />
            <span className="text-white">{category?.name}</span>
          </nav>

          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
            {category?.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-white/75">
            Professional {category?.name?.toLowerCase()} for corporate teams, hospitality, and industrial environments across the UAE.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/products?category=${category?.id}`}
              className={cn(buttonVariants({ variant: "accent", size: "cta" }), "px-8")}
            >
              Shop all {category?.name}
            </Link>
            <Link
              href="/contact"
              className={cn(
                buttonVariants({ variant: "outline", size: "cta" }),
                "border-white/20 bg-transparent px-8 text-white hover:bg-white/10"
              )}
            >
              Request a quote
            </Link>
          </div>
          <p className="mt-4 text-sm font-medium uppercase tracking-widest text-white/50">
            {productCount} products available
          </p>
        </div>
      </section>

      {subcategories.length > 0 && (
        <section className="border-b border-border bg-muted py-16">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Shop by type</h2>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {subcategories.map((sub) => (
                <Card key={sub.id} className="gap-0 py-0 transition-colors hover:border-accent">
                  <CardContent className="p-5">
                    <Link href={`/categories/${sub.slug}`} className="group block">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-accent">
                        {sub.name}
                      </h3>
                      <div className="mt-3 flex items-center gap-1 text-sm font-medium text-muted-foreground group-hover:text-accent">
                        Explore <ArrowRight size={14} />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Featured in {category?.name}</h2>
              <p className="mt-1 text-muted-foreground">Top picks from this category.</p>
            </div>
            <Link
              href={`/products?category=${category?.id}`}
              className="text-sm font-semibold text-accent hover:text-[#b89b60]"
            >
              View all
            </Link>
          </div>

          {isLoading && !initialData ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} user={user} showDescription={false} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/40 px-6 py-12 text-center">
              <p className="text-sm text-muted-foreground">
                No featured products in this category yet.
              </p>
              <Link
                href={`/products?category=${category?.id}`}
                className="mt-4 inline-flex text-sm font-semibold text-accent hover:text-[#b89b60]"
              >
                Browse all {category?.name} products
              </Link>
            </div>
          )}
        </div>
      </section>
    </StorefrontLayout>
  );
}
