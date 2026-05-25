import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export default function StockBadge({ stockQty, className = "" }) {
  const inStock = stockQty == null ? true : stockQty > 0;

  if (inStock) {
    return (
      <Badge
        variant="outline"
        className={`h-auto gap-1.5 border-[#2d7a4f]/20 bg-[#2d7a4f]/10 px-2.5 py-1 text-xs font-semibold text-[#2d7a4f] ${className}`}
      >
        <Check size={12} />
        In stock
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className={`h-auto gap-1.5 px-2.5 py-1 text-xs font-semibold ${className}`}>
      <X size={12} />
      Out of stock
    </Badge>
  );
}
