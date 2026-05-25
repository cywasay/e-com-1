"use client";

import { useQuery } from "@tanstack/react-query";
import Navbar from "./Navbar";
import Footer from "./Footer";
import CompareBar from "./CompareBar";
import QuoteBar from "./QuoteBar";
import useCompareStore from "@/store/compareStore";
import useQuoteStore from "@/store/quoteStore";
import api from "@/lib/api";
import { cn } from "@/lib/utils";

export default function StorefrontShell({ children }) {
  const compareCount = useCompareStore((state) => state.items.length);
  const quoteCount = useQuoteStore((state) => state.items.length);
  const bottomPad =
    quoteCount > 0 && compareCount > 0
      ? "pb-36"
      : quoteCount > 0 || compareCount > 0
        ? "pb-28"
        : "";

  const { data: settings } = useQuery({
    queryKey: ["public-settings"],
    queryFn: () => api.get("/settings/public").then((res) => res.data.data),
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <Navbar />
      <main className={cn("flex-1", bottomPad)}>{children}</main>
      <Footer settings={settings} />
      <QuoteBar />
      <CompareBar />
    </div>
  );
}
