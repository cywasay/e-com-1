"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  MapPin,
  Package,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import api from "@/lib/api";
import useAuthStore from "@/store/authStore";
import { isApprovedB2b, isB2bBuyer } from "@/lib/userRoles";
import AccountPageHeader from "./_components/AccountPageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function AccountDashboardClient() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["account-summary"],
    queryFn: () => api.get("/account/summary").then((res) => res.data.data),
  });

  const quickLinks = [
    {
      href: "/account/orders",
      icon: ShoppingBag,
      label: "Orders",
      description: "Track purchases and invoices",
      stat: data?.orders_count ?? 0,
      statLabel: "total orders",
    },
    {
      href: "/account/quotes",
      icon: FileText,
      label: "Quotes",
      description: "View submitted quote requests",
      stat: data?.quotes_count ?? 0,
      statLabel: "quote requests",
    },
    {
      href: "/account/addresses",
      icon: MapPin,
      label: "Addresses",
      description: "Default shipping details",
      stat: data?.has_address ? "Set" : "Missing",
      statLabel: "shipping address",
    },
    {
      href: "/account/profile",
      icon: User,
      label: "Profile",
      description: "Name, company, and password",
      stat: user?.company_name ? "Company" : "Personal",
      statLabel: "account type",
    },
  ];

  if (isB2bBuyer(user)) {
    quickLinks.push({
      href: "/account/wholesale",
      icon: Truck,
      label: "Wholesale",
      description: "Partnership and pricing status",
      stat: user?.b2b_status?.replace(/_/g, " ") || "none",
      statLabel: "B2B status",
    });
  }

  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-accent">
          <LayoutDashboard size={18} />
          <span className="text-xs font-bold uppercase tracking-widest">Account</span>
        </div>
        <AccountPageHeader
          title={`Welcome back, ${user?.name?.split(" ")[0] || "there"}`}
          description={
            isApprovedB2b(user)
              ? "Your wholesale account is active. Browse catalog pricing and manage quote requests here."
              : isB2bBuyer(user)
                ? "Your wholesale application is being reviewed. You can still request quotes at list pricing."
                : "Manage your orders, quotes, and account settings in one place."
          }
        />
        {isB2bBuyer(user) && (
          <Badge variant={isApprovedB2b(user) ? "accent" : "outline"} className="uppercase tracking-widest text-[10px]">
            {isApprovedB2b(user) ? "Wholesale approved" : `B2B ${user.b2b_status || "pending"}`}
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="h-full transition-colors hover:border-accent">
              <CardContent className="flex h-full flex-col p-5">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <link.icon size={18} />
                </div>
                <h3 className="font-semibold text-foreground">{link.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{link.description}</p>
                <div className="mt-auto pt-4">
                  <p className="text-lg font-bold capitalize text-foreground">{link.stat}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {link.statLabel}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base">Recent orders</CardTitle>
            <Link href="/account/orders" className="text-xs font-semibold text-accent hover:text-[#b89b60]">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-5">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : data?.recent_orders?.length ? (
              <div className="divide-y divide-border">
                {data.recent_orders.map((order) => (
                  <Link
                    key={order.id}
                    href={`/account/orders/${order.id}`}
                    className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Package size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">Order #{order.id}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} · AED {order.total_amount}
                        </p>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-muted-foreground" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <p>No orders yet.</p>
                <Link href="/products" className={cn(buttonVariants({ variant: "link" }), "mt-2 text-accent")}>
                  Browse catalog
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between border-b">
            <CardTitle className="text-base">Recent quotes</CardTitle>
            <Link href="/account/quotes" className="text-xs font-semibold text-accent hover:text-[#b89b60]">
              View all
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="space-y-3 p-5">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : data?.recent_quotes?.length ? (
              <div className="divide-y divide-border">
                {data.recent_quotes.map((quote) => (
                  <div key={quote.id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {quote.product_interest || `Quote #${quote.id}`}
                        </p>
                        <p className="text-xs capitalize text-muted-foreground">
                          {quote.status.replace(/_/g, " ")} · {new Date(quote.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-[10px] uppercase">
                      {quote.items?.length || 0} items
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                <p>No quote requests yet.</p>
                <Link href="/quote" className={cn(buttonVariants({ variant: "link" }), "mt-2 text-accent")}>
                  Build a quote
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!isB2bBuyer(user) && (
        <Card className="border-accent/20 bg-accent/5">
          <CardContent className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-foreground">Need wholesale pricing?</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Apply for a B2B account to access tier pricing and dedicated support.
              </p>
            </div>
            <Link href="/wholesale" className={cn(buttonVariants({ variant: "accent", size: "sm" }), "shrink-0")}>
              Apply for wholesale
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
