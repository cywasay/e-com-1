"use client";

import Link from "next/link";
import { FileText, X } from "lucide-react";
import useQuoteStore from "@/store/quoteStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function QuoteBar() {
  const items = useQuoteStore((state) => state.items);
  const removeItem = useQuoteStore((state) => state.removeItem);
  const clearAll = useQuoteStore((state) => state.clearAll);
  const itemCount = useQuoteStore((state) => state.getItemCount());

  if (items.length === 0) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-primary px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <FileText size={18} className="shrink-0 text-accent" />
          <p className="text-sm font-semibold text-white">
            Quote draft ({items.length} products, {itemCount} units)
          </p>
        </div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:justify-center sm:pb-0">
          {items.map((item) => (
            <div
              key={`${item.product_id}-${item.variant_id || "base"}`}
              className="flex shrink-0 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1.5"
            >
              {item.image ? (
                <img src={item.image} alt="" className="h-8 w-8 rounded object-contain bg-white" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-[10px] text-white/60">
                  N/A
                </div>
              )}
              <div className="min-w-0">
                <p className="max-w-[120px] truncate text-xs font-medium text-white">{item.name}</p>
                <p className="text-[10px] text-white/60">Qty {item.quantity}</p>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.product_id, item.variant_id)}
                className="rounded p-0.5 text-white/60 hover:text-white"
                aria-label={`Remove ${item.name} from quote`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-white/70 hover:bg-white/10 hover:text-white"
          >
            Clear
          </Button>
          <Link
            href="/quote"
            className={cn(buttonVariants({ variant: "accent", size: "sm" }), "uppercase tracking-widest")}
          >
            Submit quote
          </Link>
        </div>
      </div>
    </div>
  );
}
