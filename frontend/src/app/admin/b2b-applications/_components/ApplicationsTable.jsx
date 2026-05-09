"use client";
import { Fragment } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ApplicationDetailRow from "./ApplicationDetailRow";

export default function ApplicationsTable({ apps, isLoading, expandedId, setExpandedId, ...props }) {
  if (isLoading) return <LoadingSkeleton />;
  if (!apps?.length) return <div className="py-20 text-center text-gray-400 italic text-sm bg-white">No applications found for this filter.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">Applicant</th>
            <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">Company</th>
            <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest">Volume</th>
            <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-center">Status</th>
            <th className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {apps.map((app) => (
            <Fragment key={app.id}>
              <tr onClick={() => setExpandedId(expandedId === app.id ? null : app.id)} className={`hover:bg-gray-50 cursor-pointer transition-colors ${expandedId === app.id ? "bg-blue-50/30" : ""}`}>
                <td className="px-6 py-4"><div className="font-bold text-gray-900">{app.user.name}</div><div className="text-[10px] text-gray-400 font-medium">{app.user.email}</div></td>
                <td className="px-6 py-4"><div className="font-medium text-gray-700">{app.company_name}</div><div className="text-[10px] text-gray-400 font-medium">{app.business_type}</div></td>
                <td className="px-6 py-4 text-gray-600 font-medium">{app.est_order_volume}</td>
                <td className="px-6 py-4 text-center"><StatusBadge status={app.status} /></td>
                <td className="px-6 py-4 text-right flex items-center justify-end gap-3"><div className="text-[10px] text-gray-400 font-medium">{new Date(app.created_at).toLocaleDateString()}</div>{expandedId === app.id ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-gray-300" />}</td>
              </tr>
              {expandedId === app.id && <ApplicationDetailRow app={app} {...props} />}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200"
  };
  return <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${colors[status] || colors.pending}`}>{status}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse h-16 border-b border-gray-100 flex items-center px-6 gap-8">
          <div className="h-4 w-32 bg-gray-100 rounded" /><div className="h-4 w-32 bg-gray-100 rounded" /><div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
