"use client";
import QuoteManagementPanel from "./QuoteManagementPanel";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function QuoteDetailRow({ quote, onUpdate, isUpdating }) {
  return (
    <tr className="bg-muted/30">
      <td colSpan="5" className="px-10 py-10 border-t border-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            {quote.items?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">
                  Line items
                </h4>
                <div className="overflow-hidden rounded-lg border border-border bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Variant</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {quote.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.product_name}</TableCell>
                          <TableCell className="text-muted-foreground">{item.variant_label || "—"}</TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">
                            {item.unit_price ? `AED ${Number(item.unit_price).toFixed(2)}` : "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Request Message</h4>
              <div className="bg-white p-6 rounded-lg border border-border text-foreground text-sm leading-relaxed shadow-sm">
                {quote.message}
              </div>
            </div>
            <div className="flex gap-10">
              <div><h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Phone</h4><p className="font-bold text-sm text-foreground">{quote.phone}</p></div>
              <div><h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Submitted On</h4><p className="font-bold text-sm text-foreground">{new Date(quote.created_at).toLocaleString()}</p></div>
            </div>
          </div>
          <QuoteManagementPanel quote={quote} onUpdate={onUpdate} isUpdating={isUpdating} />
        </div>
      </td>
    </tr>
  );
}
