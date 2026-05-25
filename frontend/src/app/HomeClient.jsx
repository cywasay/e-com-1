"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import StorefrontLayout from "@/components/StorefrontLayout";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import { ArrowRight, Shield, Truck, Award, BookOpen, Briefcase, FileText } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function HomeClient({ initialProducts, initialCategories, initialBlogPosts = [], initialCaseStudies = [] }) {
  const { user } = useAuthStore();

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["public", "products", "featured"],
    queryFn: async () => {
      const response = await api.get("/products", {
        params: { is_featured: 1, per_page: 8 },
      });
      return response.data;
    },
    initialData: { data: { data: initialProducts } },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["public", "categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
    initialData: { data: initialCategories },
  });

  const products = productsData?.data?.data || initialProducts || [];
  const categories = categoriesData?.data || initialCategories || [];

  return (
    <StorefrontLayout>
      <section className="border-b border-[#ffffff]/10 bg-[#1a1a2e] py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl leading-tight font-bold tracking-tight text-white md:text-5xl">
              Premium Corporate Uniforms & Workwear
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed font-medium text-white/80">
              Equip your workforce with high-quality, durable, and comfortable apparel designed for the demands of the UAE and GCC region.
            </p>
            <div className="flex flex-col gap-4 pt-4 sm:flex-row">
              <Link
                href="/products"
                className={cn(buttonVariants({ variant: "accent", size: "cta" }), "px-8")}
              >
                View Catalog
              </Link>
              <Link
                href="/contact"
                className={cn(buttonVariants({ variant: "outline", size: "cta" }), "border-[#c8a96e] bg-transparent px-8 text-[#c8a96e] hover:bg-[#c8a96e]/10")}
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-muted py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { icon: Shield, title: "Uncompromising Quality", desc: "Fabrics tested for durability and comfort in extreme conditions." },
              { icon: Truck, title: "Reliable Fulfillment", desc: "Efficient logistics network ensuring timely delivery across the GCC." },
              { icon: Award, title: "B2B Excellence", desc: "Dedicated account management and custom pricing for enterprise clients." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-4">
                <div className="rounded-lg border border-border bg-white p-3 text-accent">
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Industries We Serve</h2>
            <Link href="/products" className="text-sm font-semibold text-accent hover:text-[#b89b60]">
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-4">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Card key={cat.id} className="gap-0 py-0 transition-colors hover:border-accent">
                  <CardContent className="p-6">
                    <Link href={`/categories/${cat.slug}`} className="group block">
                      <h3 className="text-lg font-semibold text-foreground transition-colors group-hover:text-accent">
                        {cat.name}
                      </h3>
                      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-accent">
                        Browse Selection <ArrowRight size={14} />
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <Card key={i} className="h-32 animate-pulse gap-0 py-0">
                  <CardContent className="flex flex-col justify-center gap-4 p-6">
                    <div className="h-6 w-3/4 rounded bg-muted" />
                    <div className="h-4 w-1/2 rounded bg-muted" />
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-foreground">Featured Products</h2>
            <p className="mt-2 text-muted-foreground">Our most requested corporate wear.</p>
          </div>

          {isLoadingProducts && !initialProducts?.length ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} user={user} showDescription={false} />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-border bg-muted/50 px-6 py-12 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No featured products yet. Mark products as Featured in the admin catalog to show them here.
              </p>
              <Link
                href="/products"
                className="mt-4 inline-flex text-sm font-semibold text-accent hover:text-[#b89b60]"
              >
                Browse full catalog
              </Link>
            </div>
          )}
        </div>
      </section>

      {(initialBlogPosts.length > 0 || initialCaseStudies.length > 0) && (
        <section className="border-t border-border bg-white py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-foreground">Insights & Success Stories</h2>
                <p className="mt-2 text-muted-foreground">Industry news and proven results from the field.</p>
              </div>
              <div className="flex gap-4 text-sm font-semibold">
                <Link href="/blog" className="text-accent hover:text-[#b89b60]">View blog</Link>
                <Link href="/case-studies" className="text-accent hover:text-[#b89b60]">Case studies</Link>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {initialBlogPosts.map((post) => (
                <Card key={post.id} className="group gap-0 overflow-hidden py-0 transition-colors hover:border-accent">
                  <Link href={`/blog/${post.slug}`} className="block h-full">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {post.featured_image ? (
                        <img src={post.featured_image} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-border">
                          <BookOpen size={40} />
                        </div>
                      )}
                    </div>
                    <CardContent className="space-y-3 p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Blog</p>
                      <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-accent">{post.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt || post.content?.substring(0, 120)}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}

              {initialCaseStudies.map((item) => (
                <Card key={item.id} className="group gap-0 overflow-hidden py-0 transition-colors hover:border-accent">
                  <Link href={`/case-studies/${item.slug}`} className="block h-full">
                    <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                      {item.featured_image ? (
                        <img src={item.featured_image} alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      ) : (
                        <div className="flex h-full items-center justify-center text-border">
                          <Briefcase size={40} />
                        </div>
                      )}
                    </div>
                    <CardContent className="space-y-3 p-6">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-accent">Case Study</p>
                      <h3 className="line-clamp-2 text-lg font-semibold text-foreground group-hover:text-accent">{item.title}</h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">{item.excerpt || item.content?.substring(0, 120)}</p>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-border bg-muted py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">Download Product Catalogs</h2>
              <p className="mt-2 text-muted-foreground">
                Browse our latest PDF collections for healthcare, hospitality, industrial, and corporate wear.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Link href="/catalogs" className={cn(buttonVariants({ variant: "outline", size: "cta" }), "gap-2")}>
                <FileText size={16} />
                View Catalogs
              </Link>
              <Link href="/contact" className={cn(buttonVariants({ variant: "accent", size: "cta" }))}>
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a2e] py-16">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h2 className="mb-4 text-2xl font-bold text-white">Enterprise Wholesale Accounts</h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/80">
            Register for a B2B account to access exclusive tier pricing, dedicated support, and streamlined bulk ordering.
          </p>
          <Link
            href="/wholesale"
            className={cn(buttonVariants({ variant: "accent", size: "cta" }), "px-8")}
          >
            Apply for Wholesale Account
          </Link>
        </div>
      </section>
    </StorefrontLayout>
  );
}
