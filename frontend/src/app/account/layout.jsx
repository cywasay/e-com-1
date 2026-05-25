"use client";

import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import { useConfirm } from "@/components/ConfirmProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, LayoutDashboard, ShoppingBag, User, LogOut, MapPin, Truck } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { isB2bBuyer } from "@/lib/userRoles";

export default function AccountLayout({ children }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const confirm = useConfirm();

  const navItems = [
    { label: "Dashboard", href: "/account", icon: LayoutDashboard, exact: true },
    { label: "Order History", href: "/account/orders", icon: ShoppingBag },
    { label: "Quote Requests", href: "/account/quotes", icon: FileText },
    { label: "Shipping Addresses", href: "/account/addresses", icon: MapPin },
    ...(isB2bBuyer(user)
      ? [{ label: "Wholesale Status", href: "/account/wholesale", icon: Truck }]
      : []),
    { label: "Profile Settings", href: "/account/profile", icon: User },
  ];

  const isNavActive = (item) => {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      description: "You will need to sign in again to access your account.",
      confirmLabel: "Log out",
      destructive: true,
    });
    if (confirmed) logout();
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-muted font-sans">
        <Navbar />

        <div className="relative flex w-full flex-1 flex-col lg:flex-row">
          <aside className="flex w-full shrink-0 flex-col border-b border-border bg-white lg:min-h-full lg:w-[280px] lg:border-r lg:border-b-0">
            <div className="border-b border-border/50 bg-gradient-to-b from-white to-muted/30 p-8">
              <Avatar className="mb-4 h-12 w-12 shadow-sm">
                <AvatarFallback className="bg-primary text-lg font-black text-accent">
                  {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
                </AvatarFallback>
              </Avatar>
              <div className="mb-0.5 text-[16px] font-black tracking-tight text-foreground">{user?.name}</div>
              <div className="text-[12px] font-bold tracking-wide break-all text-muted-foreground">{user?.email}</div>
              {user?.role === "b2b_buyer" && (
                <Badge variant="accent" className="mt-3 text-[9px] uppercase tracking-widest">
                  Corporate Account
                </Badge>
              )}
            </div>

            <nav className="flex-1 py-8">
              <div className="space-y-2 px-8">
                <div className="mb-4 pl-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Manage Account
                </div>
                {navItems.map((item) => {
                  const isActive = isNavActive(item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative flex items-center gap-4 rounded-xl px-4 py-3.5 transition-all group ${
                        isActive
                          ? "bg-muted text-accent"
                          : "text-foreground hover:bg-muted hover:text-accent"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute top-1/2 left-0 h-6 w-[3px] -translate-y-1/2 rounded-r-full bg-accent shadow-[0_0_8px_rgba(200,169,110,0.6)]" />
                      )}
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={
                          isActive
                            ? "text-accent"
                            : "text-muted-foreground transition-colors group-hover:text-accent"
                        }
                      />
                      <span className={`text-[13px] tracking-wide ${isActive ? "font-black" : "font-bold"}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="mt-auto border-t border-border/50 bg-muted/20 p-8">
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                className="h-auto w-full justify-start gap-3 rounded-xl px-4 py-3 text-[13px] font-bold hover:border hover:border-border hover:bg-white hover:shadow-sm"
              >
                <LogOut size={16} />
                <span className="tracking-wide">Log out securely</span>
              </Button>
            </div>
          </aside>

          <main className="flex flex-1 flex-col">
            <div className="w-full max-w-5xl p-8 md:p-12 lg:p-16">{children}</div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
