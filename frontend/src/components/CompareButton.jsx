"use client";

import { GitCompare } from "lucide-react";
import useCompareStore, { MAX_COMPARE } from "@/store/compareStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

export default function CompareButton({ product, className = "", size = "sm" }) {
  const toggleItem = useCompareStore((state) => state.toggleItem);
  const isInCompare = useCompareStore((state) => state.isInCompare(product.slug));
  const count = useCompareStore((state) => state.items.length);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isInCompare) {
      toggleItem(product);
      return;
    }

    if (count >= MAX_COMPARE) {
      toast.error(`You can compare up to ${MAX_COMPARE} products at a time.`);
      return;
    }

    toggleItem(product);
  };

  return (
    <Button
      type="button"
      variant={isInCompare ? "accent" : "outline"}
      size={size}
      onClick={handleToggle}
      className={cn(
        "gap-1.5 text-[10px] uppercase tracking-widest",
        isInCompare && "border-accent",
        className
      )}
      aria-pressed={isInCompare}
    >
      <GitCompare size={12} />
      {isInCompare ? "Added" : "Compare"}
    </Button>
  );
}
