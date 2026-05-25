"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Toaster } from "react-hot-toast";
import useAuthStore from "@/store/authStore";
import { useConfirm } from "@/components/ConfirmProvider";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  FolderTree,
  ShoppingBag,
  Settings,
  Users,
  CheckCircle2,
  Store,
  Clock,
  LogOut,
  ExternalLink,
  User as UserIcon,
  FileText,
  Briefcase,
  BookOpen,
  Package,
  CircleDollarSign,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Management",
    items: [
      { href: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
      { href: "/admin/products", icon: Package, label: "Products" },
      { href: "/admin/categories", icon: FolderTree, label: "Categories" },
      { href: "/admin/sites", icon: Store, label: "Sites", superAdminOnly: true },
      { href: "/admin/orders", icon: ShoppingBag, label: "Orders" },
      { href: "/admin/customers", icon: Users, label: "Customers" },
      { href: "/admin/pricing", icon: CircleDollarSign, label: "Pricing" },
    ],
  },
  {
    label: "Inquiries",
    items: [
      { href: "/admin/quotes", icon: Clock, label: "Quotes" },
      { href: "/admin/b2b-applications", icon: CheckCircle2, label: "B2B Applications" },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/admin/blog", icon: FileText, label: "Blog" },
      { href: "/admin/case-studies", icon: Briefcase, label: "Case Studies" },
      { href: "/admin/catalogs", icon: BookOpen, label: "Catalogs" },
    ],
  },
  {
    label: "Settings",
    superAdminOnly: true,
    items: [{ href: "/admin/settings", icon: Settings, label: "Store Settings" }],
  },
];

function NavLink({ href, icon: Icon, label, exact = false, pathname }) {
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-accent/15 text-accent border-l-2 border-accent -ml-px pl-[calc(0.75rem-2px)]"
          : "text-white/65 hover:bg-white/5 hover:text-white border-l-2 border-transparent"
      )}
    >
      <Icon size={17} className="shrink-0 opacity-90" />
      <span>{label}</span>
    </Link>
  );
}

export default function AdminLayoutClient({ children }) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const confirm = useConfirm();
  const isSuperAdmin = user?.role === "super_admin";

  const handleLogout = async () => {
    const confirmed = await confirm({
      title: "Log out?",
      description: "You will need to sign in again to access the admin panel.",
      confirmLabel: "Log out",
      destructive: true,
    });
    if (confirmed) logout();
  };

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <aside className="fixed inset-y-0 left-0 z-50 flex h-svh w-64 flex-col overflow-hidden border-r border-white/10 bg-primary">
          <div className="flex h-16 shrink-0 items-center border-b border-white/10 px-5">
            <Link href="/admin" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                <span className="text-sm font-black">U</span>
              </div>
              <span className="text-base font-bold tracking-tight text-white">
                uniforms<span className="text-accent">.ae</span>
              </span>
            </Link>
          </div>

          <div className="admin-sidebar-nav min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-5">
            <div className="space-y-6">
              {NAV_SECTIONS.map((section) => {
                if (section.superAdminOnly && !isSuperAdmin) return null;

                const items = section.items.filter(
                  (item) => !item.superAdminOnly || isSuperAdmin
                );
                if (items.length === 0) return null;

                return (
                  <div key={section.label}>
                    <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                      {section.label}
                    </p>
                    <nav className="space-y-0.5">
                      {items.map((item) => (
                        <NavLink key={item.href} {...item} pathname={pathname} />
                      ))}
                    </nav>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="shrink-0 border-t border-white/10 p-3">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-3 text-white/65 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={17} />
              Log out
            </Button>
          </div>
        </aside>

        <div className="ml-64 flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="hidden sm:inline-flex uppercase tracking-widest text-[10px]">
                Admin
              </Badge>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <p className="text-sm font-medium text-muted-foreground hidden sm:block">
                Store management console
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <ExternalLink size={14} />
                View storefront
              </Link>
              <Separator orientation="vertical" className="h-4" />
              <div className="hidden text-right md:block">
                <p className="text-xs font-semibold text-foreground">{user?.name || "Admin"}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {user?.role?.replace(/_/g, " ")}
                </p>
              </div>
              <Avatar size="sm">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {user?.name?.charAt(0)?.toUpperCase() || <UserIcon size={14} />}
                </AvatarFallback>
              </Avatar>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            <div className="mx-auto max-w-[1600px]">{children}</div>
          </main>
        </div>
      </div>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--foreground)",
            border: "1px solid var(--border)",
          },
        }}
      />
    </>
  );
}
