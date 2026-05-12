"use client";
import { useEffect, useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function ProductPricing({ formData, setFormData }) {
  const [metrics, setMetrics] = useState({ profit: 0, margin: 0 });

  // Calculate profit and margin whenever price or cost changes
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
      
      // Sync margin back to formData if needed for backend
      if (parseFloat(formData.margin_percentage) !== parseFloat(margin.toFixed(2))) {
        setFormData(prev => ({ ...prev, margin_percentage: margin.toFixed(2) }));
      }

      // SMART SYNC: Update variants that match the "old" price logic
      // (This ensures that if you haven't manually changed a variant's price, it stays in sync)
      if (formData.variants?.length > 0) {
        setFormData(prev => {
          const newVariants = prev.variants.map(v => {
            // If the variant price is 0 or matches the "main" price logically, sync it
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
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-100">
        <h3 className="text-sm font-semibold text-slate-800">Price</h3>
      </div>
      
      <div className="p-6 space-y-6">
        {/* Main Price Input */}
        <div className="space-y-2">
          <div className="relative max-w-xs">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
            <input 
              type="number"
              step="0.01"
              value={formData.price ?? ""}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
              className="w-full border border-slate-300 pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        {/* Additional display prices section */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between group cursor-pointer">
            <span className="text-sm font-medium text-slate-700">Additional display prices</span>
            <ChevronDown size={18} className="text-slate-400" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm text-slate-600 flex items-center gap-1">
                Compare-at price <HelpCircle size={14} className="text-slate-400" />
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
                <input 
                  type="number"
                  step="0.01"
                  value={formData.compare_at_price ?? ""}
                  onChange={(e) => setFormData({...formData, compare_at_price: e.target.value})}
                  className="w-full border border-slate-300 pl-10 pr-10 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  placeholder="0.00"
                />
                <HelpCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-600">Unit price</label>
              <div className="relative">
                <div className="w-full border border-slate-300 px-4 py-2 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-between">
                  <span>--</span>
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 py-2">
            <input 
              type="checkbox"
              id="charge_tax"
              checked={formData.charge_tax}
              onChange={(e) => setFormData({...formData, charge_tax: e.target.checked})}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="charge_tax" className="text-sm text-slate-700 font-medium cursor-pointer">Charge tax on this product</label>
          </div>
        </div>

        {/* Metrics Row (Cost, Profit, Margin) */}
        <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-4">
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg p-1 pr-3">
            <span className="text-xs text-slate-500 pl-2">Cost</span>
            <input 
              type="number"
              step="0.01"
              value={formData.base_cost ?? ""}
              onChange={(e) => setFormData({...formData, base_cost: e.target.value})}
              className="w-16 bg-slate-100 border-none px-2 py-1 text-sm rounded focus:outline-none text-slate-600 font-medium"
              placeholder="--"
            />
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-500">Profit</span>
            <span className="text-sm font-medium text-slate-700">{metrics.profit === "0.00" ? "--" : `Rs ${metrics.profit}`}</span>
          </div>

          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-2">
            <span className="text-xs text-slate-500">Margin</span>
            <span className="text-sm font-medium text-slate-700">{metrics.margin === "0" ? "--" : `${metrics.margin}%`}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
