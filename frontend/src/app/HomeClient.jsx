"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { Loader2, ArrowRight, ShoppingBag, Shield, Truck, Award } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function HomeClient({ initialProducts, initialCategories }) {
  const { user } = useAuthStore();

  const { data: productsData, isLoading: isLoadingProducts } = useQuery({
    queryKey: ["public", "products", "featured"],
    queryFn: async () => {
      const response = await api.get("/products");
      return response.data;
    },
    initialData: { data: { data: initialProducts } }
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["public", "categories"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data;
    },
    initialData: { data: initialCategories }
  });

  const products = productsData?.data?.data || initialProducts || [];
  const categories = categoriesData?.data || initialCategories || [];

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar dark={false} />

      {/* HERO SECTION */}
      <section className="bg-[#1a1a2e] py-24 border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white leading-tight">
              Premium Corporate Uniforms & Workwear
            </h1>
            <p className="text-lg text-white/80 font-medium leading-relaxed max-w-2xl">
              Equip your workforce with high-quality, durable, and comfortable apparel designed for the demands of the UAE and GCC region.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/products" 
                className="bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-md font-semibold hover:bg-[#b89b60] transition-colors inline-flex items-center justify-center"
              >
                View Catalog
              </Link>
              <Link 
                href="/contact" 
                className="bg-transparent border border-[#c8a96e] text-[#c8a96e] px-8 py-3 rounded-md font-semibold hover:bg-[#c8a96e]/10 transition-colors inline-flex items-center justify-center"
              >
                Request a Quote
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="py-16 bg-[#f8f7f4] border-b border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-[#e8e4dc] rounded-lg text-[#c8a96e]">
                <Shield size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Uncompromising Quality</h3>
                <p className="text-sm text-[#6b6560] mt-1">Fabrics tested for durability and comfort in extreme conditions.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-[#e8e4dc] rounded-lg text-[#c8a96e]">
                <Truck size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">Reliable Fulfillment</h3>
                <p className="text-sm text-[#6b6560] mt-1">Efficient logistics network ensuring timely delivery across the GCC.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-white border border-[#e8e4dc] rounded-lg text-[#c8a96e]">
                <Award size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-[#1a1a2e]">B2B Excellence</h3>
                <p className="text-sm text-[#6b6560] mt-1">Dedicated account management and custom pricing for enterprise clients.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES SECTION */}
      <section className="py-20 bg-[#f8f7f4]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">Industries We Serve</h2>
            <Link href="/products" className="text-sm font-semibold text-[#c8a96e] hover:text-[#b89b60]">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <Link 
                  key={cat.id} 
                  href={`/products?category=${cat.id}`}
                  className="group block p-6 bg-white border border-[#e8e4dc] rounded-lg hover:border-[#c8a96e] transition-colors"
                >
                  <h3 className="font-semibold text-lg text-[#1a1a2e] group-hover:text-[#c8a96e] transition-colors">{cat.name}</h3>
                  <div className="mt-4 text-sm text-[#6b6560] font-medium flex items-center gap-1 group-hover:text-[#c8a96e] transition-colors">
                    Browse Selection <ArrowRight size={14} />
                  </div>
                </Link>
              ))
            ) : (
              [...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-white border border-[#e8e4dc] rounded-lg animate-pulse flex flex-col justify-center p-6 gap-4">
                  <div className="h-6 w-3/4 bg-gray-100 rounded" />
                  <div className="h-4 w-1/2 bg-gray-100 rounded" />
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 bg-white border-t border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-10">
            <h2 className="text-2xl font-bold tracking-tight text-[#1a1a2e]">Featured Products</h2>
            <p className="text-[#6b6560] mt-2">Our most requested corporate wear.</p>
          </div>

          {isLoadingProducts && !initialProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-[#e8e4dc] rounded-lg overflow-hidden animate-pulse">
                  <div className="aspect-[4/5] bg-gray-100" />
                  <div className="p-4 border-t border-[#e8e4dc] space-y-3">
                    <div className="h-4 w-3/4 bg-gray-100 rounded" />
                    <div className="h-4 w-1/4 bg-gray-100 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.slice(0, 8).map(product => {
                const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
                return (
                  <Link key={product.id} href={`/products/${product.slug}`} className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden hover:border-[#c8a96e] transition-colors">
                    <div className="aspect-[4/5] bg-[#f8f7f4] relative">
                      {primaryImage ? (
                        <img 
                          src={primaryImage.full_url} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#e8e4dc]">
                          <ShoppingBag size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="p-4 border-t border-[#e8e4dc]">
                      <h3 className="font-semibold text-[#1a1a2e] group-hover:text-[#c8a96e] transition-colors line-clamp-1">{product.name}</h3>
                      <div className="mt-2">
                        {user ? (
                          <span className="font-semibold text-[#1a1a2e]">AED {product.price || '0.00'}</span>
                        ) : (
                          <span className="text-xs font-semibold text-[#6b6560] bg-[#f8f7f4] px-2 py-1 rounded">Login for pricing</span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="bg-[#1a1a2e] py-16">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Enterprise Wholesale Accounts</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            Register for a B2B account to access exclusive tier pricing, dedicated support, and streamlined bulk ordering.
          </p>
          <Link 
            href="/register" 
            className="bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-md font-semibold hover:bg-[#b89b60] transition-colors inline-block"
          >
            Apply for Wholesale Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
