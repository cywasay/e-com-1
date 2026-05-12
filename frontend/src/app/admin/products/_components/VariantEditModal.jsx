"use client";
import { useState, useEffect } from "react";
import { X, Info } from "lucide-react";

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

  if (!isOpen) return null;

  const variantName = Object.values(localData.options || {}).join(" / ");

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl relative overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-semibold text-slate-800">Edit {variantName}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto">
          {/* Create Toggle */}
          <div className="flex items-center gap-3">
            <input 
              type="checkbox"
              id="is_active_modal"
              checked={localData.is_active}
              onChange={(e) => setLocalData({...localData, is_active: e.target.checked})}
              className="w-5 h-5 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
            />
            <label htmlFor="is_active_modal" className="text-sm font-medium text-slate-700">Create this variant</label>
          </div>

          <div className="space-y-6 pt-2">
            {/* Price */}
            <div className="max-w-[240px]">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">Rs</span>
                <input 
                  type="number"
                  step="0.01"
                  value={localData.price ?? ""}
                  onChange={(e) => setLocalData({...localData, price: e.target.value})}
                  className="w-full border border-slate-300 pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all text-sm font-medium"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Metrics */}
            <div className="flex flex-wrap gap-4 pt-1">
              <div className="flex items-center gap-2 border border-slate-200 rounded-xl p-1 pr-3">
                <span className="text-xs text-slate-500 pl-2">Cost</span>
                <input 
                  type="number"
                  step="0.01"
                  value={localData.base_cost || ""}
                  onChange={(e) => setLocalData({...localData, base_cost: e.target.value})}
                  className="w-20 bg-slate-50 border-none px-2 py-1 text-sm rounded-lg focus:outline-none text-slate-600 font-medium"
                  placeholder="Rs 0.00"
                />
              </div>

              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2">
                <span className="text-xs text-slate-500">Profit</span>
                <span className={`text-sm font-medium ${parseFloat(metrics.profit) < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                  {parseFloat(metrics.profit) < 0 ? `-Rs ${Math.abs(metrics.profit)}` : `Rs ${metrics.profit}`}
                </span>
              </div>

              <div className="flex items-center gap-2 border border-slate-200 rounded-xl px-4 py-2">
                <span className="text-xs text-slate-500">Margin</span>
                <span className={`text-sm font-medium ${parseFloat(metrics.margin) < 0 ? 'text-red-500' : 'text-slate-700'}`}>
                  {metrics.margin}%
                </span>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Inventory</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-600">SKU (Stock Keeping Unit)</label>
                <input 
                  type="text"
                  value={localData.sku || ""}
                  onChange={(e) => setLocalData({...localData, sku: e.target.value})}
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-600">Barcode (ISBN, UPC, GTIN, etc.)</label>
                <input 
                  type="text"
                  value={localData.barcode || ""}
                  onChange={(e) => setLocalData({...localData, barcode: e.target.value})}
                  className="w-full border border-slate-300 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
            <Info size={16} className="text-slate-400 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">Save the product to edit more variant details.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex items-center justify-end gap-3 bg-slate-50/50">
          <button 
            type="button" 
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={() => onSave(localData)}
            className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
