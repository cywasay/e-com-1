"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProductInventory({ formData, setFormData }) {
  const [showMoreDetails, setShowMoreDetails] = useState(true);

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="px-5 py-4 flex-row items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">Inventory</h3>
        <div className="flex items-center gap-2">
          <Label htmlFor="track-inventory" className="text-xs text-muted-foreground">Inventory tracked</Label>
          <Switch
            id="track-inventory"
            checked={formData.track_inventory}
            onCheckedChange={(checked) => setFormData({ ...formData, track_inventory: checked })}
          />
        </div>
      </CardHeader>

      {formData.track_inventory && (
        <CardContent className="border-t border-border px-5 py-3">
          <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            <span>Quantity</span>
            <span>Quantity</span>
          </div>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-foreground">Shop location</span>
            <Input
              type="number"
              min="0"
              value={formData.stock_qty ?? 0}
              onChange={(e) => setFormData({ ...formData, stock_qty: parseInt(e.target.value) || 0 })}
              className="w-20 text-right"
            />
          </div>
        </CardContent>
      )}

      <div className="border-t border-border">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="w-full px-5 py-4 h-auto justify-between hover:bg-muted/50"
        >
          <span className="text-sm font-medium text-foreground">More details</span>
          {showMoreDetails ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </Button>

        {showMoreDetails && (
          <CardContent className="px-5 pb-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">SKU (Stock Keeping Unit)</Label>
                <Input
                  type="text"
                  value={formData.sku ?? ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-muted-foreground">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                <Input
                  type="text"
                  value={formData.barcode ?? ""}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <div className="flex items-center gap-2.5">
                <Checkbox
                  id="continue-selling"
                  checked={formData.continue_selling_when_out_of_stock}
                  onCheckedChange={(checked) => setFormData({ ...formData, continue_selling_when_out_of_stock: checked })}
                />
                <Label htmlFor="continue-selling" className="text-sm text-foreground cursor-pointer">
                  Continue selling when out of stock
                </Label>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Info size={14} />
                <span>POS excluded</span>
              </div>
            </div>
          </CardContent>
        )}
      </div>
    </Card>
  );
}
