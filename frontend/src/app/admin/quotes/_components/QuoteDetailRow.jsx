"use client";
import QuoteManagementPanel from "./QuoteManagementPanel";

export default function QuoteDetailRow({ quote, onUpdate, isUpdating, updateResult }) {
  return (
    <tr className="bg-slate-50/30">
      <td colSpan="5" className="px-10 py-10 border-t border-slate-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Request Message</h4>
              <div className="bg-white p-6 rounded-lg border border-slate-200 text-slate-700 text-sm leading-relaxed shadow-sm">
                {quote.message}
              </div>
            </div>
            <div className="flex gap-10">
              <div><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Phone</h4><p className="font-bold text-sm text-slate-900">{quote.phone}</p></div>
              <div><h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Submitted On</h4><p className="font-bold text-sm text-slate-900">{new Date(quote.created_at).toLocaleString()}</p></div>
            </div>
          </div>
          <QuoteManagementPanel quote={quote} onUpdate={onUpdate} isUpdating={isUpdating} updateResult={updateResult} />
        </div>
      </td>
    </tr>
  );
}
