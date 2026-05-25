"use client";

import { FileText } from "lucide-react";
import useQuoteStore from "@/store/quoteStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function AddToQuoteButton({
  product,
  variant = null,
  quantity = null,
  className = "",
  size = "sm",
  label = "Add to quote",
}) {
  const router = useRouter();
  const addItem = useQuoteStore((state) => state.addItem);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    addItem(product, {
      variant_id: variant?.id || null,
      variant_label: variant
        ? Object.values(variant.options || {}).join(" / ")
        : null,
      quantity,
    });

    toast.success(`${product.name} added to quote`);
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={handleClick}
      className={cn("gap-1.5 text-[10px] uppercase tracking-widest", className)}
    >
      <FileText size={12} />
      {label}
    </Button>
  );
}

export function useGoToQuote() {
  const router = useRouter();
  return () => router.push("/quote");
}
