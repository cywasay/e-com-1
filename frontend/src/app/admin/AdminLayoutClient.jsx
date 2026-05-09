"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import { 
  LayoutDashboard, 
  Tag, 
  ShoppingBag, 
  Settings, 
  Users, 
  CheckCircle2, 
  Store, 
  Clock, 
  LogOut,
  ChevronRight,
  User as UserIcon,
  FileText,
  Briefcase,
  BookOpen
} from 'lucide-react';

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);

  const NavLink = ({ href, children, icon: Icon }) => {
    const isExact = href === '/admin';
    const active = isExact ? pathname === href : pathname.startsWith(href);

    return (
      <Link
        href={href}
        className={`group flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-100 ${
          active 
            ? 'bg-blue-600 text-white' 
            : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
        }`}
      >
        <Icon size={18} className="flex-shrink-0" />
        <span className="text-sm font-medium">{children}</span>
        {active && (
          <ChevronRight size={14} className="ml-auto opacity-70" />
        )}
      </Link>
    );
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 fixed inset-y-0 left-0 bg-slate-950 border-r border-slate-900 flex flex-col z-50">
        <div className="h-16 flex items-center px-6 border-b border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center text-white">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <h1 className="text-white font-bold text-base tracking-wider">
              uniforms<span className="text-blue-500">.ae</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-6 space-y-7 custom-scrollbar">
          <div>
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Management
            </p>
            <nav className="space-y-1">
              <NavLink href="/admin" icon={LayoutDashboard}>Dashboard</NavLink>
              <NavLink href="/admin/products" icon={ShoppingBag}>Products</NavLink>
              <NavLink href="/admin/categories" icon={Tag}>Categories</NavLink>
              {user?.role === 'super_admin' && (
                <NavLink href="/admin/sites" icon={Store}>Sites</NavLink>
              )}
              <NavLink href="/admin/orders" icon={ShoppingBag}>Orders</NavLink>
              <NavLink href="/admin/customers" icon={Users}>Customers</NavLink>
              {user?.role === 'super_admin' && (
                <NavLink href="/admin/pricing" icon={Tag}>Pricing Engine</NavLink>
              )}
            </nav>
          </div>

          <div>
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Inquiries
            </p>
            <nav className="space-y-1">
              <NavLink href="/admin/quotes" icon={Clock}>Quotes</NavLink>
              <NavLink href="/admin/b2b-applications" icon={CheckCircle2}>B2B Applications</NavLink>
            </nav>
          </div>

          <div>
            <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Content
            </p>
            <nav className="space-y-1">
              <NavLink href="/admin/blog" icon={FileText}>Blog</NavLink>
              <NavLink href="/admin/case-studies" icon={Briefcase}>Case Studies</NavLink>
              <NavLink href="/admin/catalogs" icon={BookOpen}>Catalogs</NavLink>
            </nav>
          </div>

          {user?.role === 'super_admin' && (
            <div>
              <p className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Settings
              </p>
              <nav className="space-y-1">
                <NavLink href="/admin/settings" icon={Settings}>Store Settings</NavLink>
              </nav>
            </div>
          )}

          <div className="pt-4 border-t border-slate-900">
            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/30 transition-colors duration-100"
            >
              <LogOut size={18} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold text-slate-400 tracking-widest uppercase">uniforms.ae</h2>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Admin Panel</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-slate-900">{user?.name || 'Admin'}</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">{user?.role?.replace('_', ' ')}</p>
            </div>
            <div className="w-px h-4 bg-slate-200" />
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <UserIcon size={16} className="text-slate-500" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
      `}</style>
    </div>
  );
}
