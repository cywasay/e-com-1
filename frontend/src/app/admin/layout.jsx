"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import ProtectedRoute from '@/components/ProtectedRoute';
import useAuthStore from '@/store/authStore';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const NavLink = ({ href, children }) => {
    // Exact match for dashboard, startswith for others
    const isExact = href === '/admin';
    const active = isExact ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        href={href}
        className="relative block px-4 py-2 text-sm text-gray-300 group"
      >
        {active && (
          <>
            <motion.div
              layoutId="active-pill"
              className="absolute left-0 top-0 bottom-0 w-1 bg-[#008060]"
              initial={false}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <div className="absolute inset-0 bg-white/10" />
          </>
        )}
        <span className={`relative z-10 transition-colors duration-200 ${active ? 'text-white font-semibold' : 'group-hover:text-white'}`}>
          {children}
        </span>
      </Link>
    );
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-[#F6F6F7] font-sans" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* Sidebar */}
        <div className="w-60 fixed inset-y-0 left-0 bg-[#1A1C1D] overflow-y-auto">
          <div className="p-6">
            <h1 className="text-white font-bold text-xl tracking-tight">PlatformAdmin</h1>
          </div>

          <div className="mt-4">
            <div className="px-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Super Admin
            </div>
            <nav className="space-y-0.5">
              <NavLink href="/admin">Dashboard</NavLink>
              <NavLink href="/admin/brands">Brands</NavLink>
              <NavLink href="/admin/orders">Orders</NavLink>
              <NavLink href="/admin/financials">Financials</NavLink>
              <NavLink href="/admin/settings">Settings</NavLink>
            </nav>
          </div>

          <div className="px-4 my-6">
            <hr className="border-gray-800" />
          </div>

          <div>
            <div className="px-4 mb-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Store / Brand
            </div>
            <nav className="space-y-0.5">
              <NavLink href="/admin/storefronts">All Storefronts</NavLink>
              <NavLink href="/admin/pending">Pending Approvals</NavLink>
              <NavLink href="/admin/suspended">Suspended Brands</NavLink>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 ml-60 flex flex-col min-h-screen">
          {/* Top Bar */}
          <header className="h-14 bg-white border-b border-[#E1E3E5] flex items-center justify-between px-8 shrink-0">
            <h2 className="text-lg font-bold text-gray-900 capitalize">
              {pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop().replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {user?.name || 'Admin'}
              </span>
              <button
                onClick={logout}
                className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-none p-0 cursor-pointer transition-colors"
              >
                Logout
              </button>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
