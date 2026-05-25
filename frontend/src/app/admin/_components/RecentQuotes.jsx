"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { FileText, ChevronRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentQuotes() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get("/admin/dashboard").then((res) => res.data.data),
  });

  return (
    <Card className="flex h-full min-h-[420px] flex-col py-0">
      <CardHeader className="flex shrink-0 flex-row items-center justify-between border-b px-6 py-4">
        <CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
          <FileText size={16} className="text-accent" />
          Recent quotes
        </CardTitle>
        <Link href="/admin/quotes" className={buttonVariants({ variant: "ghost", size: "sm" })}>
          View all
          <ChevronRight size={14} />
        </Link>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col p-0">
        {isLoading ? (
          <div className="flex flex-1 flex-col justify-center space-y-3 p-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : stats?.recent_quotes?.length ? (
          <div className="flex flex-1 flex-col divide-y divide-border">
            {stats.recent_quotes.map((quote) => (
              <Link
                key={quote.id}
                href="/admin/quotes"
                className="flex items-center justify-between px-6 py-4 transition-colors hover:bg-muted/50"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {quote.product_interest || quote.company_name || `Quote #${quote.id}`}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {quote.name} · {new Date(quote.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline" className="text-[10px] uppercase">
                  {quote.status?.replace(/_/g, " ")}
                </Badge>
              </Link>
            ))}
          </div>
        ) : (
          <p className="flex flex-1 items-center justify-center px-6 py-10 text-center text-sm text-muted-foreground">
            No quote requests yet.
          </p>
        )}
      </CardContent>
      <CardFooter className="mt-auto shrink-0 border-t bg-muted/30 p-4">
        <Link href="/admin/quotes" className="w-full">
          <Button variant="default" className="w-full">
            Manage quotes
            <ArrowUpRight size={14} />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
