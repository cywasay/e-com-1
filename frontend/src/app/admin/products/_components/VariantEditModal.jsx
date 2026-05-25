"use client";
import { useState, useEffect } from "react";
import { Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function VariantEditModal({ variant, isOpen, onClose, onSave }) {
  const [localData, setLocalData] = useState({ 
    ...variant,
    price: variant?.price ?? "",
    base_cost: variant?.base_cost ?? "",
    sku: variant?.sku ?? "",
    barcode: variant?.barcode ?? "",
    is_active: variant?.is_active ?? true
  });
  const [metrics, setMetrics] = useState({ profit: 0, margin: 0 });

  useEffect(() => {
    if (variant) {
      setLocalData({ 
        ...variant,
        price: variant.price ?? "",
        base_cost: variant.base_cost ?? "",
        sku: variant.sku ?? "",
        barcode: variant.barcode ?? "",
        is_active: variant.is_active ?? true
      });
    }
  }, [variant]);

  useEffect(() => {
    const price = parseFloat(localData.price || 0);
    const cost = parseFloat(localData.base_cost || 0);
    if (price > 0) {
      const profit = price - cost;
      const margin = (profit / price) * 100;
      setMetrics({ profit: profit.toFixed(2), margin: margin.toFixed(1) });
    } else {
      setMetrics({ profit: "0.00", margin: "0" });
    }
  }, [localData.price, localData.base_cost]);

  const variantName = Object.values(localData.options || {}).join(" / ");

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <DialogTitle>Edit {variantName}</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-8 overflow-y-auto max-h-[70vh]">
          <div className="flex items-center gap-3">
            <Checkbox
              id="is_active_modal"
              checked={localData.is_active}
              onCheckedChange={(checked) => setLocalData({ ...localData, is_active: checked })}
            />
            <Label htmlFor="is_active_modal" className="text-sm font-medium text-foreground">Create this variant</Label>
          </div>

          <div className="space-y-6 pt-2">
            <div className="max-w-[240px]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs</span>
                <Input
                  type="number"
                  step="0.01"
                  value={localData.price ?? ""}
                  onChange={(e) => setLocalData({ ...localData, price: e.target.value })}
                  className="pl-10"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-2 border border-border rounded-xl p-1 pr-3">
                <span className="text-xs text-muted-foreground pl-2">Cost</span>
                <Input
                  type="number"
                  step="0.01"
                  value={localData.base_cost || ""}
                  onChange={(e) => setLocalData({ ...localData, base_cost: e.target.value })}
                  className="w-20 border-none bg-muted h-7 px-2"
                  placeholder="Rs 0.00"
                />
              </div>

              <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2">
                <span className="text-xs text-muted-foreground">Profit</span>
                <span className={`text-sm font-medium ${parseFloat(metrics.profit) < 0 ? "text-red-500" : "text-foreground"}`}>
                  {parseFloat(metrics.profit) < 0 ? `-Rs ${Math.abs(metrics.profit)}` : `Rs ${metrics.profit}`}
                </span>
              </div>

              <div className="flex items-center gap-2 border border-border rounded-xl px-4 py-2">
                <span className="text-xs text-muted-foreground">Margin</span>
                <span className={`text-sm font-medium ${parseFloat(metrics.margin) < 0 ? "text-red-500" : "text-foreground"}`}>
                  {metrics.margin}%
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border">
            <h4 className="text-xs font-bold text-foreground uppercase tracking-widest">Inventory</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">SKU (Stock Keeping Unit)</Label>
                <Input
                  type="text"
                  value={localData.sku || ""}
                  onChange={(e) => setLocalData({ ...localData, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                <Input
                  type="text"
                  value={localData.barcode || ""}
                  onChange={(e) => setLocalData({ ...localData, barcode: e.target.value })}
                />
              </div>
            </div>
          </div>

          <Alert>
            <Info size={16} />
            <AlertDescription className="text-xs">
              Save the product to edit more variant details.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="p-6 border-t border-border bg-muted/50">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="button" onClick={() => onSave(localData)}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
