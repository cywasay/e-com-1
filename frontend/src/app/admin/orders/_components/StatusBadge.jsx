import { Badge } from "@/components/ui/badge";

export default function StatusBadge({ status }) {
  const variantMap = {
    pending: "outline",
    processing: "secondary",
    shipped: "secondary",
    delivered: "default",
    cancelled: "destructive",
    refunded: "outline",
  };

  return (
    <Badge variant={variantMap[status] || "outline"} className="text-[9px] font-black uppercase tracking-widest">
      {status}
    </Badge>
  );
}
