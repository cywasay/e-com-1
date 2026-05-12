"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown, Info } from "lucide-react";

export default function ProductInventory({ formData, setFormData }) {
  const [showMoreDetails, setShowMoreDetails] = useState(true);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">Inventory</h3>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <span className="text-xs text-slate-500">Inventory tracked</span>
          <button
            type="button"
            role="switch"
            aria-checked={formData.track_inventory}
            onClick={() => setFormData({ ...formData, track_inventory: !formData.track_inventory })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              formData.track_inventory ? "bg-slate-900" : "bg-slate-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                formData.track_inventory ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </label>
      </div>

      {/* Quantity Section - Only shows when tracking is enabled */}
      {formData.track_inventory && (
        <div className="border-t border-slate-100">
          <div className="px-5 py-3">
            <div className="flex items-center justify-between text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">
              <span>Quantity</span>
              <span>Quantity</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-700">Shop location</span>
              <input
                type="number"
                min="0"
                value={formData.stock_qty ?? 0}
                onChange={(e) => setFormData({ ...formData, stock_qty: parseInt(e.target.value) || 0 })}
                className="w-20 border border-slate-300 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* More details Section */}
      <div className="border-t border-slate-100">
        <button
          type="button"
          onClick={() => setShowMoreDetails(!showMoreDetails)}
          className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
        >
          <span className="text-sm font-medium text-slate-700">More details</span>
          {showMoreDetails ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
        </button>

        {showMoreDetails && (
          <div className="px-5 pb-5 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm text-slate-600">SKU (Stock Keeping Unit)</label>
                <input
                  type="text"
                  value={formData.sku ?? ""}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder=""
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-600">Barcode (ISBN, UPC, GTIN, etc.)</label>
                <input
                  type="text"
                  value={formData.barcode ?? ""}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                  placeholder=""
                />
              </div>
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.continue_selling_when_out_of_stock}
                  onChange={(e) => setFormData({ ...formData, continue_selling_when_out_of_stock: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Continue selling when out of stock</span>
              </label>

              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Info size={14} />
                <span>POS excluded</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
