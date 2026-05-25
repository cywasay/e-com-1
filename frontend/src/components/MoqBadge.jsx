import { Badge } from "@/components/ui/badge";
import { getProductMoq } from "@/lib/userRoles";

export default function MoqBadge({ product, className = "" }) {
  const moq = getProductMoq(product);
  if (!moq) return null;

  return (
    <Badge variant="outline" className={`text-[9px] uppercase tracking-widest ${className}`}>
      MOQ {moq}
    </Badge>
  );
}
