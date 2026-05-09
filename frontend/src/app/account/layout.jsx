"use client";

import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, LogOut, MapPin, Truck } from "lucide-react";

export default function AccountLayout({ children }) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();

  const navItems = [
    { label: "Order History", href: "/account/orders", icon: ShoppingBag },
    { label: "Shipping Addresses", href: "/account/addresses", icon: MapPin },
    { label: "Wholesale Status", href: "/account/wholesale", icon: Truck },
    { label: "Profile Settings", href: "/account/profile", icon: User },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col bg-[#f8f7f4] font-sans">
        <Navbar />

        <div className="flex flex-col lg:flex-row flex-1 w-full relative">
          {/* TRUE SIDEBAR - Flush Left on Desktop, Top on Mobile */}
          <aside className="w-full lg:w-[280px] bg-white lg:border-r border-b lg:border-b-0 border-[#e8e4dc] flex flex-col shrink-0 lg:min-h-full">
            {/* User Profile Block */}
            <div className="p-8 border-b border-[#e8e4dc]/50 bg-gradient-to-b from-white to-[#f8f7f4]/30">
              <div className="w-12 h-12 rounded-full bg-[#1a1a2e] text-[#c8a96e] flex items-center justify-center font-black text-lg mb-4 shadow-sm">
                {user?.name?.charAt(0).toUpperCase() || <User size={20} />}
              </div>
              <div className="text-[16px] font-black text-[#1a1a2e] tracking-tight mb-0.5">{user?.name}</div>
              <div className="text-[12px] font-bold text-[#6b6560] tracking-wide break-all">{user?.email}</div>
              {user?.role === 'b2b_buyer' && (
                <div className="mt-3 inline-flex items-center px-2.5 py-1 rounded-full bg-[#c8a96e]/10 text-[#c8a96e] text-[9px] font-black uppercase tracking-widest border border-[#c8a96e]/20">
                  Corporate Account
                </div>
              )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-8">
              <div className="px-8 space-y-2">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#6b6560] mb-4 pl-4">Manage Account</div>
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-4 py-3.5 px-4 rounded-xl transition-all relative group ${
                        isActive
                          ? "bg-[#f8f7f4] text-[#c8a96e]"
                          : "text-[#1a1a2e] hover:bg-[#f8f7f4] hover:text-[#c8a96e]"
                      }`}
                    >
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#c8a96e] rounded-r-full shadow-[0_0_8px_rgba(200,169,110,0.6)]" />
                      )}
                      <item.icon
                        size={18}
                        strokeWidth={isActive ? 2.5 : 2}
                        className={
                          isActive
                            ? "text-[#c8a96e]"
                            : "text-[#6b6560] group-hover:text-[#c8a96e] transition-colors"
                        }
                      />
                      <span className={`text-[13px] tracking-wide ${isActive ? 'font-black' : 'font-bold'}`}>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </nav>

            <div className="mt-auto p-8 border-t border-[#e8e4dc]/50 bg-[#f8f7f4]/20">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 py-3 px-4 rounded-xl text-[13px] font-bold text-[#6b6560] hover:bg-white hover:text-[#1a1a2e] hover:shadow-sm border border-transparent hover:border-[#e8e4dc] transition-all"
              >
                <LogOut size={16} />
                <span className="tracking-wide">Log out securely</span>
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <main className="flex-1 flex flex-col">
            <div className="w-full max-w-4xl p-8 md:p-12 lg:p-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
