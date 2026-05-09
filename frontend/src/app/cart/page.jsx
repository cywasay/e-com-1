"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import { Trash2 as Trash, Plus as Add, Minus as Sub, ShoppingBag as Bag, ArrowLeft as Back } from "lucide-react";

export default function CartPage() {
  const { token } = useAuthStore();
  const router = useRouter();
  const { items, removeItem, updateQuantity, getCartTotal, getCartCount } = useCartStore();

  useEffect(() => {
    if (!token) {
      router.push("/login");
    }
  }, [token, router]);

  if (!token) return null;

  return (
      <div className="min-h-screen bg-[#f8f7f4] font-sans text-[#1a1a2e]">
        <header className="bg-white border-b border-[#e8e4dc] py-6">
          <div className="max-w-5xl mx-auto px-4 flex items-center gap-4">
            <Link href="/products" className="text-[#6b6560] hover:text-[#1a1a2e] transition-colors">
              <Back size={20} />
            </Link>
            <h1 className="text-xl font-bold tracking-tight">Your Cart</h1>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-12">
          {items.length === 0 ? (
            <div className="bg-white rounded-2xl p-20 text-center shadow-sm border border-[#e8e4dc]">
              <div className="w-20 h-20 bg-[#f8f7f4] rounded-full flex items-center justify-center mx-auto mb-6">
                <Bag className="text-[#e8e4dc]" size={40} />
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-[#6b6560] mb-8">Looks like you haven't added anything to your cart yet.</p>
              <Link href="/products" className="inline-block bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#b89b60] transition-all">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Items List */}
              <div className="lg:col-span-8 space-y-4">
                {items.map((item) => (
                  <div key={`${item.product_id}-${item.variant_id}`} className="bg-white rounded-2xl p-4 flex items-center gap-6 shadow-sm border border-[#e8e4dc]">
                    <div className="w-24 h-32 bg-[#f8f7f4] rounded-lg overflow-hidden flex-shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#e8e4dc]">
                          <Bag size={32} />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <h3 className="font-bold text-[#1a1a2e]">{item.name}</h3>
                      {item.variant_label && (
                        <p className="text-xs font-medium text-[#6b6560] uppercase tracking-widest">{item.variant_label}</p>
                      )}
                      <p className="text-sm font-semibold pt-1 text-[#1a1a2e]">AED {item.price}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-[#e8e4dc] rounded-full px-2 py-1 bg-[#f8f7f4]">
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.variant_id, -1)}
                          className="p-1 hover:text-[#c8a96e] transition-colors"
                        >
                          <Sub size={14} />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#1a1a2e]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product_id, item.variant_id, 1)}
                          className="p-1 hover:text-[#c8a96e] transition-colors"
                        >
                          <Add size={14} />
                        </button>
                      </div>
                      
                      <button 
                        onClick={() => removeItem(item.product_id, item.variant_id)}
                        className="p-2 text-[#6b6560] hover:text-red-500 transition-colors"
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="lg:col-span-4 sticky top-24">
                <div className="bg-white rounded-2xl p-8 space-y-6 shadow-sm border border-[#e8e4dc]">
                  <h2 className="text-lg font-bold text-[#1a1a2e]">Order Summary</h2>
                  
                  <div className="space-y-4 text-sm font-medium">
                    <div className="flex justify-between text-[#6b6560]">
                      <span>Subtotal ({getCartCount()} items)</span>
                      <span className="text-[#1a1a2e]">AED {getCartTotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-[#6b6560]">
                      <span>Shipping</span>
                      <span className="text-[#2d7a4f]">Calculated at next step</span>
                    </div>
                    <div className="border-t border-[#e8e4dc] pt-4 flex justify-between text-lg font-bold text-[#1a1a2e]">
                      <span>Total</span>
                      <span>AED {getCartTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <Link 
                    href="/checkout"
                    className="w-full bg-[#c8a96e] text-[#1a1a2e] py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#b89b60] transition-all flex items-center justify-center"
                  >
                    Proceed to Checkout
                  </Link>

                  <p className="text-[10px] text-center text-[#6b6560] font-medium">Secure checkout powered by Stripe</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
  );
}
