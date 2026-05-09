"use client";
import { X, Loader2 } from "lucide-react";

export default function CreatePriceSetModal({ isOpen, onClose, onCreate, isPending }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight mb-6">New Price Set</h2>
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            onCreate({ name: fd.get("name"), type: fd.get("type"), is_active: true });
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price Set Name</label>
            <input name="name" required className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm font-bold" placeholder="E.g. Summer 2026 Sale" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</label>
            <select name="type" className="w-full bg-gray-50 border-none px-4 py-3 rounded-xl focus:ring-1 focus:ring-blue-500 outline-none text-sm font-bold">
              <option value="global_sale">Global Sale (All B2B)</option>
              <option value="buyer_specific">Buyer Specific Override</option>
            </select>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="button" onClick={onClose} className="flex-1 px-6 py-3 border border-gray-200 text-gray-400 font-bold uppercase tracking-widest text-[10px] rounded-xl">Cancel</button>
            <button type="submit" disabled={isPending} className="flex-1 bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-slate-900 transition-all flex items-center justify-center gap-2">
              {isPending ? <Loader2 size={12} className="animate-spin" /> : "Create Set"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
