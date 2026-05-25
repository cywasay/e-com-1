"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export default function NavSearch({ className = "" }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ products: [], categories: [] });
  const containerRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open || query.trim().length < 2) {
      setResults({ products: [], categories: [] });
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await api.get("/search", {
          params: { q: query.trim() },
          signal: controller.signal,
        });
        setResults(response.data.data || { products: [], categories: [] });
      } catch (error) {
        if (error.name !== "CanceledError" && error.code !== "ERR_CANCELED") {
          setResults({ products: [], categories: [] });
        }
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, open]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/products?search=${encodeURIComponent(query.trim())}`);
  };

  const hasResults =
    results.products.length > 0 || results.categories.length > 0;

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => setOpen((prev) => !prev)}
        className="text-white/80 hover:bg-white/10 hover:text-accent"
        aria-label="Search products"
        aria-expanded={open}
      >
        <Search size={18} />
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(92vw,24rem)] rounded-lg border border-border bg-card p-3 shadow-xl">
          <form onSubmit={handleSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products or categories..."
                className="h-10 pl-9"
              />
            </div>
          </form>

          <div className="mt-3 max-h-80 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center gap-2 py-6 text-sm text-muted-foreground">
                <Loader2 size={16} className="animate-spin" />
                Searching...
              </div>
            )}

            {!loading && query.trim().length >= 2 && !hasResults && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No results for &ldquo;{query.trim()}&rdquo;
              </p>
            )}

            {!loading && query.trim().length < 2 && (
              <p className="py-4 text-center text-xs text-muted-foreground">
                Type at least 2 characters to search
              </p>
            )}

            {!loading && results.categories.length > 0 && (
              <div className="mb-3">
                <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Categories
                </p>
                <div className="space-y-1">
                  {results.categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.slug}`}
                      onClick={() => setOpen(false)}
                      className="block rounded-md px-2 py-2 text-sm font-medium text-foreground hover:bg-muted"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && results.products.length > 0 && (
              <div>
                <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Products
                </p>
                <div className="space-y-1">
                  {results.products.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-md px-2 py-2 hover:bg-muted"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded border border-border bg-muted">
                        {product.images?.[0]?.full_url ? (
                          <img
                            src={product.images[0].full_url}
                            alt=""
                            className="max-h-full max-w-full object-contain p-1"
                          />
                        ) : (
                          <Search size={14} className="text-muted-foreground" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {product.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {product.category?.name || "Product"}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {!loading && query.trim().length >= 2 && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  router.push(`/products?search=${encodeURIComponent(query.trim())}`);
                }}
                className="mt-3 w-full rounded-md border border-border px-3 py-2 text-xs font-bold uppercase tracking-widest text-accent hover:bg-muted"
              >
                View all results
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
