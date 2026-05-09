"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { 
  Loader2, Search, ShoppingBag, Filter, X, 
  ChevronDown, Check, ArrowUpDown, SlidersHorizontal,
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CatalogPageClient({ initialProducts, initialCategories }) {
  const { user } = useAuthStore();
  
  // Filter States
  const [search, setSearch] = useState("");
  const [category_id, setCategoryId] = useState("");
  const [availability, setAvailability] = useState("all"); // "all", "in_stock"
  const [sort, setSort] = useState("featured");
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch Categories for Filter
  const { data: categoriesData } = useQuery({
    queryKey: ["public", "categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data.data;
    },
    initialData: initialCategories
  });

  // Fetch Products with all filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ["public", "products", "catalog", search, category_id, availability, sort],
    queryFn: async () => {
      const params = new URLSearchParams({
        search,
        category_id,
        availability,
        sort
      });
      const response = await api.get(`/products?${params.toString()}`);
      return response.data;
    },
    initialData: search || category_id || availability !== 'all' || sort !== 'featured' ? undefined : { data: { data: initialProducts, total: initialProducts.length } }
  });

  const products = productsData?.data?.data || initialProducts || [];
  const categories = categoriesData || initialCategories || [];
  const totalProducts = productsData?.data?.total || products.length || 0;

  // Helpers
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
      if (cat) tags.push({ id: 'cat', label: `Category: ${cat.name}`, onClear: () => setCategoryId("") });
    }
    if (availability === "in_stock") {
      tags.push({ id: 'stock', label: "In Stock Only", onClear: () => setAvailability("all") });
    }
    if (search) {
      tags.push({ id: 'search', label: `Search: ${search}`, onClear: () => setSearch("") });
    }
    return tags;
  };

  const activeTags = getActiveFilterTags();

  // Helper to render nested categories as flat list
  const renderCategoryOptions = (items, depth = 0) => {
    return items.map(cat => (
      <div key={cat.id} className="space-y-1">
        <button
          onClick={() => setCategoryId(category_id === cat.id.toString() ? "" : cat.id.toString())}
          className={`w-full flex items-center gap-2 py-1.5 px-2 rounded-md transition-colors text-sm ${
            category_id === cat.id.toString() 
              ? 'bg-[#c8a96e]/10 text-[#c8a96e] font-bold' 
              : 'text-[#6b6560] hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
        >
          <div className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
            category_id === cat.id.toString() ? 'bg-[#c8a96e] border-[#c8a96e]' : 'border-[#e8e4dc]'
          }`}>
            {category_id === cat.id.toString() && <Check size={12} className="text-[#1a1a2e]" />}
          </div>
          {cat.name}
        </button>
        {cat.children_recursive && cat.children_recursive.length > 0 && (
          <div className="ml-2 border-l border-gray-100">
            {renderCategoryOptions(cat.children_recursive, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar />

      {/* TOP HEADER / SEARCH */}
      <section className="bg-white border-b border-[#e8e4dc] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-black tracking-tighter uppercase text-[#1a1a2e]">Product Catalog</h1>
              <p className="text-[#6b6560] text-sm font-medium mt-1 uppercase tracking-widest">
                Premium corporate wear & industrial uniforms
              </p>
            </div>
            <div className="w-full md:w-96 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#c8a96e]" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#f8f7f4] border border-[#e8e4dc] pl-12 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-[#c8a96e] focus:ring-1 focus:ring-[#c8a96e] transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl w-full mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* SIDEBAR FILTERS (Desktop) */}
          <aside className="hidden lg:block w-64 space-y-10">
            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a2e] flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-[#c8a96e]" /> Categories
              </h3>
              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {categories.length > 0 ? renderCategoryOptions(categories) : (
                  <div className="h-20 flex items-center justify-center"><Loader2 className="animate-spin text-gray-200" /></div>
                )}
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-4 pt-6 border-t border-[#e8e4dc]">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a2e]">Availability</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setAvailability(availability === "in_stock" ? "all" : "in_stock")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    availability === "in_stock" 
                      ? 'bg-[#1a1a2e] border-[#1a1a2e] text-white' 
                      : 'bg-white border-[#e8e4dc] text-[#6b6560] hover:border-[#c8a96e]'
                  }`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest">In Stock Only</span>
                  <div className={`w-8 h-4 rounded-full relative transition-colors ${availability === "in_stock" ? 'bg-[#c8a96e]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${availability === "in_stock" ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* MOBILE FILTERS TOGGLE */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button 
              onClick={() => setIsMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-[#1a1a2e] text-white px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              <Filter size={14} /> Filters
            </button>
            <div className="text-xs font-bold uppercase tracking-widest text-[#6b6560]">
              {totalProducts} Products
            </div>
          </div>

          {/* MAIN GRID AREA */}
          <main className="flex-1 space-y-8">
            
            {/* Sorting & Stats Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="hidden sm:block text-sm font-bold text-[#6b6560] uppercase tracking-widest">
                Showing <span className="text-[#1a1a2e]">{totalProducts}</span> Products
              </div>
              
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#6b6560] whitespace-nowrap">Sort By:</span>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="bg-white border border-[#e8e4dc] text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg focus:outline-none focus:border-[#c8a96e] appearance-none cursor-pointer pr-10 relative bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjYzhhOTZlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTYgOWw2IDYgNi02Ii8+PC9zdmc+')] bg-[length:16px] bg-[right_12px_center] bg-no-repeat"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  {user && (
                    <>
                      <option value="price_low">Price: Low to High</option>
                      <option value="price_high">Price: High to Low</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Active Tags */}
            {activeTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                <div className="text-[10px] font-black uppercase tracking-widest text-[#6b6560]">Active Filters:</div>
                {activeTags.map(tag => (
                  <button 
                    key={tag.id}
                    onClick={tag.onClear}
                    className="flex items-center gap-2 bg-[#c8a96e]/10 border border-[#c8a96e]/20 text-[#c8a96e] px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#c8a96e] hover:text-[#1a1a2e] transition-all group"
                  >
                    {tag.label}
                    <X size={12} className="text-[#c8a96e] group-hover:text-[#1a1a2e]" />
                  </button>
                ))}
                <button 
                  onClick={clearFilters}
                  className="text-[10px] font-black uppercase tracking-widest text-[#1a1a2e] hover:text-[#c8a96e] ml-2"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {isLoading && !initialProducts ? (
                [...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden animate-pulse flex flex-col shadow-sm">
                    <div className="aspect-[4/5] bg-gray-100" />
                    <div className="p-6 space-y-4">
                      <div className="h-3 w-20 bg-gray-100 rounded" />
                      <div className="h-6 w-3/4 bg-gray-100 rounded" />
                      <div className="flex justify-between items-center">
                        <div className="h-6 w-24 bg-gray-100 rounded" />
                        <div className="w-10 h-10 rounded-full bg-gray-100" />
                      </div>
                    </div>
                  </div>
                ))
              ) : products.length > 0 ? (
                products.map(product => {
                  const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                  return (
                    <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white border border-[#e8e4dc] rounded-2xl overflow-hidden hover:border-[#c8a96e] transition-all flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1">
                      <div className="aspect-[4/5] bg-[#f8f7f4] relative overflow-hidden">
                        {primaryImage ? (
                          <img 
                            src={primaryImage.full_url} 
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#e8e4dc]">
                            <ShoppingBag size={48} strokeWidth={1} />
                          </div>
                        )}
                        {product.is_featured && (
                          <div className="absolute top-4 left-4 bg-[#c8a96e] text-[#1a1a2e] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                            Featured
                          </div>
                        )}
                        {product.is_new_arrival && (
                          <div className="absolute top-4 right-4 bg-[#1a1a2e] text-white text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full shadow-lg">
                            New
                          </div>
                        )}
                      </div>
                      
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="text-[10px] font-black text-[#6b6560] uppercase tracking-widest mb-2">
                          {product.category?.name || "General"}
                        </div>
                        <h3 className="font-bold text-[#1a1a2e] group-hover:text-[#c8a96e] transition-colors leading-tight mb-4 text-lg">
                          {product.name}
                        </h3>
                        <div className="mt-auto flex items-center justify-between">
                          {user ? (
                            <div className="flex flex-col">
                              <span className="text-xl font-black text-[#1a1a2e]">AED {product.resolved_price || product.price || '0.00'}</span>
                              {product.resolved_price < product.price && (
                                <span className="text-[9px] font-black text-[#2d7a4f] uppercase tracking-tighter">Corporate Discount Applied</span>
                              )}
                            </div>
                          ) : (
                            <span className="text-[10px] font-black text-[#6b6560] bg-[#f8f7f4] px-3 py-1.5 rounded-full uppercase tracking-widest border border-[#e8e4dc]">
                              Login for pricing
                            </span>
                          )}
                          <div className="w-10 h-10 rounded-full bg-[#f8f7f4] flex items-center justify-center text-[#c8a96e] group-hover:bg-[#c8a96e] group-hover:text-[#1a1a2e] transition-all">
                            <ChevronRight size={20} />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full py-20 text-center space-y-6 bg-white rounded-3xl border border-dashed border-[#e8e4dc]">
                  <div className="w-20 h-20 bg-[#f8f7f4] rounded-full flex items-center justify-center mx-auto text-[#e8e4dc]">
                    <Search size={40} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-[#1a1a2e] uppercase tracking-tighter">No Products Found</h3>
                    <p className="text-[#6b6560] text-sm font-medium mt-2">Adjust your filters or search terms and try again.</p>
                  </div>
                  <button 
                    onClick={clearFilters}
                    className="bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-[#b89b60] transition-all"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      {/* MOBILE FILTERS MODAL */}
      {isMobileFiltersOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-[#1a1a2e]/60 backdrop-blur-sm" onClick={() => setIsMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-2xl flex flex-col p-8 space-y-10 animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-black uppercase tracking-tighter">Filters</h2>
              <button onClick={() => setIsMobileFiltersOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-10 custom-scrollbar">
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a2e]">Categories</h3>
                <div className="space-y-1">
                  {categories.length > 0 ? renderCategoryOptions(categories) : <Loader2 className="animate-spin text-gray-200" />}
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#e8e4dc]">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a2e]">Availability</h3>
                <button
                  onClick={() => setAvailability(availability === "in_stock" ? "all" : "in_stock")}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border transition-all ${
                    availability === "in_stock" ? 'bg-[#1a1a2e] text-white' : 'bg-white border-[#e8e4dc] text-[#6b6560]'
                  }`}
                >
                  <span className="text-xs font-bold uppercase">In Stock Only</span>
                  <div className={`w-8 h-4 rounded-full relative ${availability === "in_stock" ? 'bg-[#c8a96e]' : 'bg-gray-200'}`}>
                    <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${availability === "in_stock" ? 'left-4.5' : 'left-0.5'}`} />
                  </div>
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsMobileFiltersOpen(false)}
              className="w-full bg-[#c8a96e] text-[#1a1a2e] py-4 rounded-xl font-black uppercase tracking-widest text-xs"
            >
              Show {totalProducts} Results
            </button>
          </div>
        </div>
      )}

      <Footer />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f8f7f4;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e8e4dc;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #c8a96e;
        }
      `}</style>
    </div>
  );
}
