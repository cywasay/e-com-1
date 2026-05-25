"use client";
import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function ProductPricing({ formData, setFormData }) {
  const [metrics, setMetrics] = useState({ profit: 0, margin: 0 });

  useEffect(() => {
    const price = parseFloat(formData.price || 0);
    const cost = parseFloat(formData.base_cost || 0);

    if (price > 0) {
      const profit = price - cost;
      const margin = (profit / price) * 100;
      setMetrics({ 
        profit: profit.toFixed(2), 
        margin: margin.toFixed(0) 
      });
      
      if (parseFloat(formData.margin_percentage) !== parseFloat(margin.toFixed(2))) {
        setFormData(prev => ({ ...prev, margin_percentage: margin.toFixed(2) }));
      }

      if (formData.variants?.length > 0) {
        setFormData(prev => {
          const newVariants = prev.variants.map(v => {
            if (!v.price || v.price === "0.00" || v.price === 0) {
              return { ...v, price: prev.price };
            }
            return v;
          });
          return { ...prev, variants: newVariants };
        });
      }
    } else {
      setMetrics({ profit: "0.00", margin: "0" });
    }
  }, [formData.price, formData.base_cost]);

  return (
    <Card className="overflow-hidden shadow-sm">
      <CardHeader className="p-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Price</h3>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs</span>
            <Input
              type="number"
              step="0.01"
              value={formData.price ?? ""}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              className="pl-10"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-foreground">Additional display prices</span>
            <ChevronDown size={18} className="text-muted-foreground" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground flex items-center gap-1">
                Compare-at price <HelpCircle size={14} className="text-muted-foreground" />
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">Rs</span>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price ?? ""}
                  onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                  className="pl-10 pr-10"
                  placeholder="0.00"
                />
                <HelpCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Unit price</Label>
              <div className="w-full border border-border px-4 py-2 rounded-lg bg-muted text-muted-foreground flex items-center justify-between">
                <span>--</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <Checkbox
              id="charge_tax"
              checked={formData.charge_tax}
              onCheckedChange={(checked) => setFormData({ ...formData, charge_tax: checked })}
            />
            <Label htmlFor="charge_tax" className="text-sm text-foreground font-medium cursor-pointer">
              Charge tax on this product
            </Label>
          </div>
        </div>

        <div className="pt-6 border-t border-border flex flex-wrap gap-4">
          <div className="flex items-center gap-2 border border-border rounded-lg p-1 pr-3">
            <span className="text-xs text-muted-foreground pl-2">Cost</span>
            <Input
              type="number"
              step="0.01"
              value={formData.base_cost ?? ""}
              onChange={(e) => setFormData({ ...formData, base_cost: e.target.value })}
              className="w-16 border-none bg-muted h-7 px-2"
              placeholder="--"
            />
          </div>

          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">Profit</span>
            <span className="text-sm font-medium text-foreground">{metrics.profit === "0.00" ? "--" : `Rs ${metrics.profit}`}</span>
          </div>

          <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-2">
            <span className="text-xs text-muted-foreground">Margin</span>
            <span className="text-sm font-medium text-foreground">{metrics.margin === "0" ? "--" : `${metrics.margin}%`}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
