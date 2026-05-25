"use client";

import Link from "next/link";
import useAuthStore from "@/store/authStore";
import useCartStore from "@/store/cartStore";
import NavCategoriesMenu from "@/components/NavCategoriesMenu";
import NavSearch from "@/components/NavSearch";
import { ShoppingBag, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { canUseCart } from "@/lib/userRoles";
import { useConfirm } from "@/components/ConfirmProvider";
import useQuoteStore from "@/store/quoteStore";
import { FileText } from "lucide-react";

export default function Navbar() {
  const { user } = useAuthStore();
  const confirm = useConfirm();
  const { getCartCount } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getCartCount() : 0;
  const quoteCount = useQuoteStore((state) => state.items.length);
  const showCart = canUseCart(user);

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      description: "You will need to sign in again to continue.",
      confirmLabel: "Log out",
      destructive: true,
    });
    if (confirmed) useAuthStore.getState().logout();
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[#ffffff]/10 bg-[#1a1a2e] py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6">
        <Link href="/" className="shrink-0 text-2xl font-bold tracking-tight text-white">
          uniforms<span className="text-[#c8a96e]">.ae</span>
        </Link>

        <div className="hidden items-center gap-6 lg:flex">
          <NavCategoriesMenu />
          <Link href="/wholesale" className="text-sm font-semibold text-white/80 transition-colors hover:text-[#c8a96e]">
            Wholesale
          </Link>
          <Link href="/catalogs" className="text-sm font-semibold text-white/80 transition-colors hover:text-[#c8a96e]">
            Catalogs
          </Link>
          <Link href="/blog" className="text-sm font-semibold text-white/80 transition-colors hover:text-[#c8a96e]">
            Blog
          </Link>
          <Link href="/case-studies" className="text-sm font-semibold text-white/80 transition-colors hover:text-[#c8a96e]">
            Case Studies
          </Link>
          <Link href="/contact" className="text-sm font-semibold text-white/80 transition-colors hover:text-[#c8a96e]">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <NavSearch />
          <Link
            href="/products"
            className="text-sm font-semibold text-white/80 transition-colors hover:text-[#c8a96e] lg:hidden"
          >
            Catalog
          </Link>

          <Separator orientation="vertical" className="mx-1 hidden h-4 bg-white/20 sm:block" />

          {showCart ? (
            <Link href="/cart" className="relative p-2 text-white/80 transition-colors hover:text-[#c8a96e]">
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <Badge className="absolute top-0 right-0 flex h-4 w-4 translate-x-1 -translate-y-1 items-center justify-center rounded-full bg-accent p-0 text-[10px] font-bold text-accent-foreground">
                  {cartCount}
                </Badge>
              )}
            </Link>
          ) : (
            <Link href="/quote" className="relative p-2 text-white/80 transition-colors hover:text-[#c8a96e]" title="Request quote">
              <FileText size={20} />
              {quoteCount > 0 && (
                <Badge className="absolute top-0 right-0 flex h-4 w-4 translate-x-1 -translate-y-1 items-center justify-center rounded-full bg-accent p-0 text-[10px] font-bold text-accent-foreground">
                  {quoteCount}
                </Badge>
              )}
            </Link>
          )}

          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-2 sm:gap-4">
                {(user.role === "super_admin" || user.role === "admin_staff") ? (
                  <Link
                    href="/admin"
                    className="text-sm font-semibold text-[#c8a96e] hover:text-[#b89b60]"
                  >
                    Admin
                  </Link>
                ) : (
                  <Link
                    href="/account"
                    className="flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-[#c8a96e]"
                  >
                    <User size={16} /> <span className="hidden sm:inline">Account</span>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-white/60 hover:bg-transparent hover:text-white/90"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Link
                href="/login"
                className={cn(buttonVariants({ variant: "accent", size: "default" }))}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
