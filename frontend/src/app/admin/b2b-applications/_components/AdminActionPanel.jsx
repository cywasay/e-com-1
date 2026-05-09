"use client";
import { Check, Loader2, X } from "lucide-react";

export default function AdminActionPanel({ appId, onApprove, onReject, isApproving, isRejecting, adminNotes, setAdminNotes }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Check size={12} /> Admin Action</h4>
      <div className="space-y-4">
        <textarea
          placeholder="Admin notes (required for rejection)..." value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          className="w-full bg-white border border-gray-200 p-3 text-xs rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-500 h-24"
        />
        <div className="flex gap-3">
          <button 
            onClick={() => onApprove(appId)}
            className="flex-1 bg-[#008060] text-white py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-[#006e52] transition-colors flex items-center justify-center gap-2"
          >
            {isApproving ? <Loader2 size={12} className="animate-spin" /> : <><Check size={14} /> Approve</>}
          </button>
          <button 
            onClick={() => {
              if (!adminNotes) return alert("Admin notes are required for rejection");
              onReject({ id: appId, notes: adminNotes });
            }}
            className="flex-1 border border-red-200 text-red-600 py-2 text-[10px] font-black uppercase tracking-widest rounded-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
          >
            {isRejecting ? <Loader2 size={12} className="animate-spin" /> : <><X size={14} /> Reject</>}
          </button>
        </div>
      </div>
    </div>
  );
}
