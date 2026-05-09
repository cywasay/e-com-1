"use client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function QuoteManagementPanel({ quote, onUpdate, isUpdating, updateResult }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Management</h4>
        <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Update Status</label>
            <select 
              value={quote.status}
              onChange={(e) => onUpdate(quote.id, e.target.value, quote.admin_notes)}
              className="w-full border-slate-200 rounded-md text-xs font-bold uppercase tracking-widest focus:ring-slate-900"
            >
              <option value="new">New</option>
              <option value="in_progress">In Progress</option>
              <option value="quoted">Quoted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Admin Notes</label>
            <textarea 
              defaultValue={quote.admin_notes}
              onBlur={(e) => onUpdate(quote.id, quote.status, e.target.value)}
              className="w-full border-slate-200 rounded-md text-xs font-medium focus:ring-slate-900 h-24"
              placeholder="Add internal notes..."
            />
          </div>
          <div className="pt-2">
            {isUpdating && <div className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-widest"><Loader2 size={12} className="animate-spin" /> Saving...</div>}
            {updateResult === quote.id && <div className="flex items-center gap-2 text-green-600 text-[10px] font-black uppercase tracking-widest"><CheckCircle2 size={12} /> Saved</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
