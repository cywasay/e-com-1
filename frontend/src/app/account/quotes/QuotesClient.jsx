"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock, FileText } from "lucide-react";
import api from "@/lib/api";
import AccountPageHeader from "../_components/AccountPageHeader";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function quoteStatusClass(status) {
  switch (status) {
    case "new":
      return "border-blue-200 bg-blue-50 text-blue-600";
    case "in_review":
      return "border-amber-200 bg-amber-50 text-amber-600";
    case "quoted":
      return "border-green-200 bg-green-50 text-green-600";
    case "closed":
      return "border-gray-200 bg-gray-50 text-gray-600";
    default:
      return "";
  }
}

function QuoteHistoryItem({ quote }) {
  return (
    <Card className="transition-colors hover:border-accent">
      <CardContent className="space-y-4 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[15px] font-bold text-foreground">
                {quote.product_interest || `Quote #${quote.id}`}
              </span>
              <Badge variant="outline" className={cn("text-[10px] uppercase tracking-wider", quoteStatusClass(quote.status))}>
                {quote.status.replace(/_/g, " ")}
              </Badge>
            </div>
            <div className="mt-1 flex items-center gap-2 text-[13px] text-muted-foreground">
              <Clock size={14} />
              {new Date(quote.created_at).toLocaleDateString()}
              {quote.company_name && (
                <>
                  <span>·</span>
                  <span>{quote.company_name}</span>
                </>
              )}
            </div>
          </div>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-widest">
            {quote.items?.length || 0} line items
          </Badge>
        </div>

        {quote.message && (
          <p className="text-sm leading-relaxed text-muted-foreground line-clamp-2">{quote.message}</p>
        )}

        {quote.items?.length > 0 && (
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Requested items</p>
            <ul className="space-y-1 text-sm text-foreground">
              {quote.items.map((item) => (
                <li key={item.id} className="flex justify-between gap-4">
                  <span>
                    {item.product_name || item.product?.name || `Product #${item.product_id}`}
                    {item.variant_label ? ` · ${item.variant_label}` : item.variant_id ? ` · Variant #${item.variant_id}` : ""}
                  </span>
                  <span className="font-semibold">Qty {item.quantity}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function QuotesClient() {
  const { data, isLoading } = useQuery({
    queryKey: ["my-quotes"],
    queryFn: () => api.get("/account/quotes").then((res) => res.data.data),
  });

  const quotes = data?.data || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <AccountPageHeader
          title="Quote requests"
          description="Track wholesale and bulk quote submissions sent to our team."
        />
        <Link href="/quote" className={cn(buttonVariants({ variant: "accent", size: "sm" }))}>
          New quote request
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-xl" />
          ))}
        </div>
      ) : quotes.length === 0 ? (
        <div className="space-y-6 py-16 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-sm text-accent">
            <FileText size={36} />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">No quote requests yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add products to your quote builder and submit when you are ready.
            </p>
          </div>
          <Link href="/quote" className={cn(buttonVariants({ variant: "default" }))}>
            Build a quote
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {quotes.map((quote) => (
            <QuoteHistoryItem key={quote.id} quote={quote} />
          ))}
        </div>
      )}
    </div>
  );
}
