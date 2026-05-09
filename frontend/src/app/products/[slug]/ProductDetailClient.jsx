"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { Loader2, ArrowLeft, ShoppingCart, ShoppingBag, Check } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

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
    enabled: !!slug
  });

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleAddToCart = () => {
    if (!user) return;
    
    // If product has variants but none selected, alert user
    if (product.variants?.length > 0 && !selectedVariant) {
      alert("Please select an option first");
      return;
    }

    const primaryImage = product.images?.find(img => img.is_primary) || product.images?.[0];
    
    addItem({
      product_id: product.id,
      slug: product.slug,
      name: product.name,
      image: primaryImage?.full_url,
      price: product.resolved_price || product.price,
      quantity: 1,
      variant_id: selectedVariant?.id || null,
      variant_label: selectedVariant ? Object.values(selectedVariant.options).join(" / ") : null
    });

    setShowSuccess(true);
  };

  if (isLoading && !initialProduct) {
    return (
      <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans">
        <Navbar />
        <div className="bg-white border-b border-[#e8e4dc]">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="h-4 w-32 bg-gray-100 rounded animate-pulse" />
          </div>
        </div>
        <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
          <div className="bg-white rounded-xl border border-[#e8e4dc] shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-[#e8e4dc]">
              <div className="p-8 md:p-12 bg-[#f8f7f4] flex flex-col items-center justify-center animate-pulse">
                <div className="w-full max-w-md aspect-[4/5] bg-gray-100 rounded-lg" />
              </div>
              <div className="p-8 md:p-12 space-y-8 animate-pulse">
                <div className="space-y-4">
                  <div className="h-3 w-20 bg-gray-100 rounded" />
                  <div className="h-10 w-3/4 bg-gray-100 rounded" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
                <div className="py-12 bg-gray-50 -mx-12 px-12" />
                <div className="space-y-4">
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                  <div className="h-20 w-full bg-gray-100 rounded" />
                </div>
                <div className="h-12 w-full bg-gray-100 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product && !isLoading) {
    return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar />
      <div className="flex-1 flex flex-col items-center justify-center py-24">
        <ShoppingBag className="text-[#e8e4dc] mb-4" size={48} />
        <h1 className="text-xl font-bold text-[#1a1a2e] mb-2">Product Not Found</h1>
        <p className="text-[#6b6560] text-sm mb-6">The product you are looking for does not exist or has been removed.</p>
        <Link href="/products" className="bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-md font-semibold hover:bg-[#b89b60] transition-colors">Back to Catalog</Link>
      </div>
      <Footer />
    </div>
    );
  }

  const primaryImage = product?.images?.find(img => img.is_primary) || product?.images?.[0];

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar />
      
      <div className="bg-white border-b border-[#e8e4dc]">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-medium text-[#6b6560] hover:text-[#1a1a2e] transition-colors">
            <ArrowLeft size={16} /> Back to Catalog
          </Link>
        </div>
      </div>

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-12">
        <div className="bg-white rounded-xl border border-[#e8e4dc] shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:divide-x divide-[#e8e4dc]">
            {/* Left: Image Gallery */}
            <div className="p-8 md:p-12 bg-[#f8f7f4] flex flex-col items-center justify-center">
              <div className="w-full max-w-md aspect-[4/5] bg-white rounded-lg overflow-hidden border border-[#e8e4dc] shadow-sm mb-6">
                 {primaryImage ? (
                    <img 
                      src={primaryImage.full_url} 
                      alt={product.name} 
                      className="w-full h-full object-cover"
                    />
                 ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#f8f7f4] text-[#e8e4dc]">
                      <ShoppingBag size={64} strokeWidth={1} />
                    </div>
                 )}
              </div>
              {product?.images?.length > 1 && (
                <div className="flex gap-4 w-full max-w-md overflow-x-auto pb-2">
                  {product.images.map(img => (
                    <button key={img.id} className="w-20 h-20 shrink-0 bg-white rounded-md overflow-hidden border border-[#e8e4dc] hover:border-[#c8a96e] transition-colors focus:outline-none focus:ring-2 focus:ring-[#c8a96e]">
                      <img src={img.full_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="space-y-3 mb-8">
                {product?.category && (
                  <span className="text-xs font-bold uppercase tracking-widest text-[#6b6560]">
                    {product.category.name}
                  </span>
                )}
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1a1a2e] leading-tight">
                  {product?.name}
                </h1>
                <p className="text-sm font-medium text-[#6b6560]">
                  SKU: {product?.sku || `PRD-${product?.id}`}
                </p>
              </div>

              <div className="py-6 border-y border-[#e8e4dc] mb-8 bg-[#f8f7f4] -mx-8 md:-mx-12 px-8 md:px-12">
                {user ? (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-[#6b6560]">Your Corporate Price</p>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl font-bold tracking-tight text-[#1a1a2e]">AED {product?.resolved_price || product?.price || '0.00'}</span>
                      {product?.resolved_price < product?.price && (
                        <div className="flex flex-col mb-1">
                          <span className="text-xs text-[#6b6560] line-through">AED {product?.price}</span>
                          <span className="text-[10px] font-bold text-[#2d7a4f] uppercase tracking-widest bg-[#2d7a4f]/10 px-1.5 py-0.5 rounded border border-[#2d7a4f]/20 inline-block mt-0.5">Discount Applied</span>
                        </div>
                      )}
                    </div>
                    {product?.stock_qty > 0 ? (
                      <p className="text-sm text-[#2d7a4f] font-medium mt-2 flex items-center gap-1.5">
                        <Check size={16} /> In stock and ready to ship
                      </p>
                    ) : (
                      <p className="text-sm text-red-600 font-medium mt-2">
                        Currently out of stock
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-[#6b6560]">Pricing is restricted to corporate accounts.</p>
                    <Link href="/login" className="inline-flex items-center text-sm font-semibold text-[#c8a96e] hover:text-[#b89b60] transition-colors">
                      Sign in to view pricing
                    </Link>
                  </div>
                )}
              </div>

              {product?.variants?.length > 0 && (
                <div className="mb-8 space-y-3">
                  <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-widest">Select Option</h3>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.map(variant => (
                      <button 
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-4 py-2 border rounded-md text-sm transition-all font-medium ${
                          selectedVariant?.id === variant.id 
                            ? 'border-[#c8a96e] bg-[#c8a96e]/10 text-[#c8a96e] ring-1 ring-[#c8a96e]' 
                            : 'border-[#e8e4dc] text-[#6b6560] hover:border-[#c8a96e] hover:bg-[#f8f7f4]'
                        }`}
                      >
                        {Object.values(variant.options).join(" / ")}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-widest">Description</h3>
                <div className="text-[#6b6560] text-sm leading-relaxed whitespace-pre-wrap">
                  {product?.description || "No detailed description provided for this product."}
                </div>
              </div>

              <div className="mt-auto relative pt-4 border-t border-[#e8e4dc]">
                {showSuccess && (
                  <div className="absolute -top-14 left-0 right-0 flex justify-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-[#1a1a2e] text-white px-4 py-2 rounded-md text-xs font-semibold flex items-center gap-2 shadow-lg">
                      <Check size={14} className="text-[#2d7a4f]" /> Added to cart successfully
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handleAddToCart}
                  disabled={!user || product?.stock_qty <= 0}
                  className={`w-full py-3.5 rounded-md font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                    showSuccess 
                      ? 'bg-[#1a1a2e] text-white' 
                      : 'bg-[#c8a96e] text-[#1a1a2e] hover:bg-[#b89b60] disabled:bg-[#f8f7f4] disabled:text-[#6b6560] disabled:cursor-not-allowed disabled:border disabled:border-[#e8e4dc]'
                  }`}
                >
                  {showSuccess ? <Check size={18} /> : <ShoppingCart size={18} />}
                  {showSuccess ? "Success" : product?.stock_qty <= 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                {!user && (
                  <p className="text-center text-xs text-[#6b6560] mt-3 font-medium">
                    Corporate account required to purchase. <Link href="/register" className="text-[#c8a96e] hover:underline">Apply here</Link>.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
