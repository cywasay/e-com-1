"use client";
import { Eye, ChevronRight, Loader2 } from "lucide-react";

export default function PricePreviewTool({ products, customers, previewProductId, setPreviewProductId, previewUserId, setPreviewUserId, onPreview, isPending, previewData }) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-lg p-6 shadow-sm">
      <div className="mb-6"><div className="flex items-center gap-2 mb-1"><Eye size={16} /><h3 className="text-base font-medium">Price resolution preview</h3></div><p className="text-sm text-gray-500">Test how the pricing engine resolves final prices.</p></div>
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 space-y-1">
          <label className="text-xs text-gray-500">Select product</label>
          <select value={previewProductId} onChange={(e) => setPreviewProductId(e.target.value)} className="w-full bg-white border border-[#e2e8f0] px-3 py-2 rounded-md text-sm outline-none">
            <option value="">Select a product...</option>
            {products?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div className="flex-1 space-y-1">
          <label className="text-xs text-gray-500">Select customer</label>
          <select value={previewUserId} onChange={(e) => setPreviewUserId(e.target.value)} className="w-full bg-white border border-[#e2e8f0] px-3 py-2 rounded-md text-sm outline-none">
            <option value="">Guest (retail)</option>
            {customers?.filter(c => c.role === 'b2b_buyer' || c.role === 'b2b').map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <button onClick={onPreview} disabled={!previewProductId || isPending} className="bg-[#008060] text-white px-6 py-2 rounded-md text-sm font-medium disabled:opacity-50 h-[38px] min-w-[140px] flex items-center justify-center gap-2">{isPending ? <Loader2 size={14} className="animate-spin" /> : "Preview price"}</button>
      </div>
      {previewData && <PreviewResult data={previewData} />}
    </div>
  );
}

function PreviewResult({ data }) {
  return (
    <div className="mt-6 p-6 bg-white rounded-lg border border-[#e2e8f0] shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        <div><p className="text-[11px] text-gray-500 mb-1">Resolved price</p><p className="text-[28px] font-bold text-[#1F2937]">AED {data.resolved_price.toFixed(2)}</p></div>
        <div><p className="text-[11px] text-gray-500 mb-2">Rule applied</p><span className="px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue-100 text-blue-700">{data.rule_applied.replace('_', ' ')}</span></div>
        <div><p className="text-[11px] text-gray-500 mb-1">Source</p><p className="text-sm font-medium text-[#1F2937] truncate">{data.price_set_name || "N/A"}</p></div>
      </div>
    </div>
  );
}
