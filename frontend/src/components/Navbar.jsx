"use client";

import Link from "next/link";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import { ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function Navbar({ dark = false }) {
  const { user } = useAuthStore();
  const { getCartCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;

  return (
    <nav className="bg-[#1a1a2e] border-b border-[#ffffff]/10 py-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold tracking-tight text-white">
          uniforms<span className="text-[#c8a96e]">.ae</span>
        </Link>
        
        <div className="flex gap-8 items-center">
          <Link href="/products" className="text-sm font-semibold text-white/80 hover:text-[#c8a96e] transition-colors">
            Catalog
          </Link>
          <Link href="/catalogs" className="text-sm font-semibold text-white/80 hover:text-[#c8a96e] transition-colors">
            Catalogs
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-white/80 hover:text-[#c8a96e] transition-colors">
            Blog
          </Link>
          <Link href="/case-studies" className="text-sm font-semibold text-white/80 hover:text-[#c8a96e] transition-colors">
            Case Studies
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-white/80 hover:text-[#c8a96e] transition-colors">
            Contact
          </Link>
          
          <div className="h-4 w-px bg-white/20 mx-2" />

          <Link href="/cart" className="relative p-2 text-white/80 hover:text-[#c8a96e] transition-colors">
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-[#c8a96e] text-[#1a1a2e] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {(user.role === 'super_admin' || user.role === 'admin_staff') ? (
                  <Link 
                    href="/admin" 
                    className="text-sm font-semibold text-[#c8a96e] hover:text-[#b89b60]"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link 
                    href="/account/orders" 
                    className="text-sm font-semibold text-white/80 hover:text-[#c8a96e] flex items-center gap-1"
                  >
                    <User size={16} /> Account
                  </Link>
                )}
                <button 
                  onClick={() => useAuthStore.getState().logout()}
                  className="text-sm font-semibold text-white/60 hover:text-white/90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="bg-[#c8a96e] text-[#1a1a2e] px-5 py-2 rounded-md text-sm font-semibold hover:bg-[#b89b60] transition-colors">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
