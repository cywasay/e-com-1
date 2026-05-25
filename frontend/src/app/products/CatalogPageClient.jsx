"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Search, Filter, X, LayoutGrid, List } from "lucide-react";
import StorefrontLayout from "@/components/StorefrontLayout";
import ProductCard, { ProductCardSkeleton } from "@/components/ProductCard";
import ProductListRow, { ProductListRowSkeleton } from "@/components/ProductListRow";
import CatalogFilters from "@/components/CatalogFilters";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

function CatalogPageInner({ initialProducts, initialCategories }) {
  const { user } = useAuthStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [search, setSearch] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [availability, setAvailability] = useState("all");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("grid");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [initializedFromUrl, setInitializedFromUrl] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get("search") || "");
    setCategoryId(searchParams.get("category") || "");
    setAvailability(searchParams.get("availability") === "in_stock" ? "in_stock" : "all");
    setSort(searchParams.get("sort") || "featured");
    setInitializedFromUrl(true);
  }, [searchParams]);

  useEffect(() => {
    if (!initializedFromUrl) return;

    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (category_id) params.set("category", category_id);
    if (availability === "in_stock") params.set("availability", "in_stock");
    if (sort && sort !== "featured") params.set("sort", sort);

    const next = params.toString();
    const current = searchParams.toString();
    if (next !== current) {
      router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
    }
  }, [search, category_id, availability, sort, initializedFromUrl, pathname, router, searchParams]);

  const { data: categoriesData } = useQuery({
    queryKey: ["public", "categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data.data;
    },
    initialData: initialCategories,
  });

  const isDefaultFilters =
    !search && !category_id && availability === "all" && sort === "featured";

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["public", "products", "catalog", search, category_id, availability, sort],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (category_id) params.set("category_id", category_id);
      if (availability === "in_stock") params.set("availability", "in_stock");
      if (sort && sort !== "featured") params.set("sort", sort);

      const qs = params.toString();
      const response = await api.get(`/products${qs ? `?${qs}` : ""}`);
      return response.data;
    },
    enabled: initializedFromUrl,
    initialData: isDefaultFilters
      ? {
          success: true,
          data: {
            data: initialProducts,
            total: initialProducts.length,
            current_page: 1,
            last_page: 1,
          },
          message: "Products retrieved successfully.",
        }
      : undefined,
  });

  const paginator = productsData?.data;
  const products = Array.isArray(paginator?.data) ? paginator.data : initialProducts;
  const totalProducts = paginator?.total ?? products.length ?? 0;
  const categories = categoriesData || initialCategories || [];

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setAvailability("all");
    setSort("featured");
  };

  const getActiveFilterTags = () => {
    const tags = [];
    if (category_id) {
      const findCategory = (list, id) => {
        for (const item of list) {
          if (item.id.toString() === id.toString()) return item;
          if (item.children_recursive) {
            const found = findCategory(item.children_recursive, id);
            if (found) return found;
          }
        }
        return null;
      };
      const cat = categories ? findCategory(categories, category_id) : null;
      if (cat) tags.push({ id: "cat", label: `Category: ${cat.name}`, onClear: () => setCategoryId("") });
    }
    if (availability === "in_stock") {
      tags.push({ id: "stock", label: "In Stock Only", onClear: () => setAvailability("all") });
    }
    if (search) {
      tags.push({ id: "search", label: `Search: ${search}`, onClear: () => setSearch("") });
    }
    return tags;
  };

  const activeTags = getActiveFilterTags();
  const hasActiveFilters = activeTags.length > 0;

  return (
    <StorefrontLayout>
      <section className="border-b border-border bg-white py-8">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
                Product Catalog
              </h1>
              <p className="mt-1 text-sm font-medium uppercase tracking-widest text-muted-foreground">
                Premium corporate wear & industrial uniforms
              </p>
            </div>
            <div className="relative w-full md:w-96">
              <Search className="absolute top-1/2 left-4 -translate-y-1/2 text-accent" size={18} />
              <Input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 rounded-xl bg-muted pl-12"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="flex flex-col gap-12 lg:flex-row">
          <aside className="hidden w-72 shrink-0 lg:block">
            <div className="sticky top-24">
              <CatalogFilters
                categories={categories}
                categoryId={category_id}
                onCategoryChange={setCategoryId}
                availability={availability}
                onAvailabilityChange={setAvailability}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </div>
          </aside>

          <div className="mb-6 flex items-center justify-between lg:hidden">
            <Button
              onClick={() => setIsMobileFiltersOpen(true)}
              variant="default"
              size="cta"
              className="rounded-full"
            >
              <Filter size={14} /> Filters
            </Button>
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              {totalProducts} Products
            </div>
          </div>

          <main className="flex-1 space-y-8">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="hidden text-sm font-bold uppercase tracking-widest text-muted-foreground sm:block">
                Showing <span className="text-foreground">{totalProducts}</span> Products
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap text-muted-foreground">
                  Sort By:
                </span>
                <Select value={sort} onValueChange={setSort}>
                  <SelectTrigger className="h-9 min-w-[180px] text-xs font-bold uppercase tracking-widest">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

                <ToggleGroup
                  type="single"
                  value={view}
                  onValueChange={(value) => value && setView(value)}
                  variant="outline"
                  spacing={0}
                  className="rounded-lg"
                >
                  <ToggleGroupItem
                    value="grid"
                    aria-label="Grid view"
                    className="h-9 gap-1.5 px-3 text-xs font-bold uppercase tracking-widest data-pressed:border-accent data-pressed:bg-accent data-pressed:text-accent-foreground"
                  >
                    <LayoutGrid size={14} />
                    Grid
                  </ToggleGroupItem>
                  <ToggleGroupItem
                    value="list"
                    aria-label="List view"
                    className="h-9 gap-1.5 px-3 text-xs font-bold uppercase tracking-widest data-pressed:border-accent data-pressed:bg-accent data-pressed:text-accent-foreground"
                  >
                    <List size={14} />
                    List
                  </ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            {activeTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Active Filters:
                </div>
                {activeTags.map((tag) => (
                  <Button
                    key={tag.id}
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={tag.onClear}
                    className="group gap-2 rounded-full border-accent/20 bg-accent/10 text-accent hover:bg-accent hover:text-accent-foreground"
                  >
                    {tag.label}
                    <X size={12} />
                  </Button>
                ))}
                <Button
                  type="button"
                  variant="ghost"
                  size="xs"
                  onClick={clearFilters}
                  className="ml-2 text-[10px] font-black uppercase tracking-widest"
                >
                  Clear All
                </Button>
              </div>
            )}

            {isLoading && !initialProducts ? (
              view === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {[...Array(6)].map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {[...Array(4)].map((_, i) => (
                    <ProductListRowSkeleton key={i} />
                  ))}
                </div>
              )
            ) : products.length > 0 ? (
              view === "grid" ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} user={user} />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {products.map((product) => (
                    <ProductListRow key={product.id} product={product} user={user} />
                  ))}
                </div>
              )
            ) : (
              <div className="space-y-6 rounded-3xl border border-dashed border-border bg-white py-20 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted text-border">
                  <Search size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black uppercase tracking-tighter text-foreground">
                    No Products Found
                  </h3>
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    Adjust your filters or search terms and try again.
                  </p>
                </div>
                <Button variant="accent" size="cta" onClick={clearFilters} className="rounded-full">
                  Clear All Filters
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>

      <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
        <SheetContent side="right" className="flex w-[min(100vw,22rem)] flex-col gap-0 p-0 sm:max-w-[22rem]" showCloseButton={false}>
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>{totalProducts} products</SheetDescription>
              </div>
              <div className="flex items-center gap-2">
                {hasActiveFilters && (
                  <Button type="button" variant="ghost" size="xs" onClick={clearFilters} className="uppercase tracking-widest text-accent">
                    Clear
                  </Button>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setIsMobileFiltersOpen(false)}
                  aria-label="Close filters"
                >
                  <X size={20} />
                </Button>
              </div>
            </div>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            <CatalogFilters
              categories={categories}
              categoryId={category_id}
              onCategoryChange={setCategoryId}
              availability={availability}
              onAvailabilityChange={setAvailability}
              onClear={clearFilters}
              hasActiveFilters={hasActiveFilters}
              embedded
            />
          </div>

          <SheetFooter className="border-t p-4">
            <Button
              type="button"
              variant="accent"
              size="cta"
              className="w-full"
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              Show {totalProducts} results
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </StorefrontLayout>
  );
}

export default function CatalogPageClient(props) {
  return (
    <Suspense fallback={null}>
      <CatalogPageInner {...props} />
    </Suspense>
  );
}
