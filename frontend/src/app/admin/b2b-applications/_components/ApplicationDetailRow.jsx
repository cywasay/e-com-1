"use client";
import { FileText } from "lucide-react";
import AdminActionPanel from "./AdminActionPanel";

export default function ApplicationDetailRow({ app, onApprove, onReject, isApproving, isRejecting, adminNotes, setAdminNotes }) {
  return (
    <tr className="bg-gray-50/50">
      <td colSpan="5" className="px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><FileText size={12} /> Application Details</h4>
            <div className="grid grid-cols-2 gap-y-4 text-xs">
              <div><p className="text-gray-400 mb-1">Company Name</p><p className="font-bold text-gray-900">{app.company_name}</p></div>
              <div><p className="text-gray-400 mb-1">Business Type</p><p className="font-bold text-gray-900">{app.business_type}</p></div>
              <div><p className="text-gray-400 mb-1">Tax ID / TRN</p><p className="font-bold text-gray-900">{app.tax_id || "Not Provided"}</p></div>
              <div><p className="text-gray-400 mb-1">Volume</p><p className="font-bold text-gray-900">{app.est_order_volume}</p></div>
            </div>
            {app.admin_notes && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-sm">
                <p className="text-[10px] font-bold text-red-700 uppercase tracking-widest mb-1">Rejection Reason</p>
                <p className="text-xs text-red-600">{app.admin_notes}</p>
              </div>
            )}
          </div>
          {app.status === 'pending' && (
            <AdminActionPanel 
              appId={app.id} onApprove={onApprove} onReject={onReject} 
              isApproving={isApproving} isRejecting={isRejecting} 
              adminNotes={adminNotes} setAdminNotes={setAdminNotes} 
            />
          )}
        </div>
      </td>
    </tr>
  );
}
