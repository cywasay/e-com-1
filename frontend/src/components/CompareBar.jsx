"use client";

import Link from "next/link";
import { GitCompare, X } from "lucide-react";
import useCompareStore from "@/store/compareStore";
import useQuoteStore from "@/store/quoteStore";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CompareBar() {
  const items = useCompareStore((state) => state.items);
  const removeItem = useCompareStore((state) => state.removeItem);
  const clearAll = useCompareStore((state) => state.clearAll);
  const quoteCount = useQuoteStore((state) => state.items.length);

  if (items.length === 0) return null;

  const compareHref = `/compare?slugs=${items.map((item) => item.slug).join(",")}`;

  return (
    <div className={cn("fixed inset-x-0 z-50 border-t border-border bg-primary px-4 py-3 shadow-lg", quoteCount > 0 ? "bottom-16" : "bottom-0")}>
      <div className="mx-auto flex max-w-7xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <GitCompare size={18} className="shrink-0 text-accent" />
          <p className="text-sm font-semibold text-white">
            Compare ({items.length}/4)
          </p>
        </div>

        <div className="flex flex-1 items-center gap-2 overflow-x-auto pb-1 sm:justify-center sm:pb-0">
          {items.map((item) => (
            <div
              key={item.slug}
              className="flex shrink-0 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2 py-1.5"
            >
              {item.image ? (
                <img src={item.image} alt="" className="h-8 w-8 rounded object-contain bg-white" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded bg-white/10 text-[10px] text-white/60">
                  N/A
                </div>
              )}
              <span className="max-w-[120px] truncate text-xs font-medium text-white">
                {item.name}
              </span>
              <button
                type="button"
                onClick={() => removeItem(item.slug)}
                className="rounded p-0.5 text-white/60 hover:text-white"
                aria-label={`Remove ${item.name} from compare`}
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
            href={compareHref}
            className={cn(buttonVariants({ variant: "accent", size: "sm" }), "uppercase tracking-widest")}
          >
            Compare now
          </Link>
        </div>
      </div>
    </div>
  );
}
