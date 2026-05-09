"use client";
import React, { Fragment } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import QuoteDetailRow from "./QuoteDetailRow";

export default function QuotesTable({ quotes, isLoading, expandedId, setExpandedId, ...props }) {
  if (isLoading) return <LoadingSkeleton />;
  if (!quotes?.length) return <EmptyState />;

  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden shadow-sm">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50/50 text-slate-400 border-b border-slate-200">
          <tr>
            <th className="px-6 py-4 font-black uppercase text-[9px] tracking-widest">Customer</th>
            <th className="px-6 py-4 font-black uppercase text-[9px] tracking-widest">Company / Interest</th>
            <th className="px-6 py-4 font-black uppercase text-[9px] tracking-widest">Status</th>
            <th className="px-6 py-4 font-black uppercase text-[9px] tracking-widest">Date</th>
            <th className="px-6 py-4 font-black uppercase text-[9px] tracking-widest text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {quotes.map((quote) => (
            <Fragment key={quote.id}>
              <tr 
                onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                className={`hover:bg-slate-50/50 transition-colors cursor-pointer ${expandedId === quote.id ? "bg-slate-50/80" : ""}`}
              >
                <td className="px-6 py-5">
                  <div className="font-black text-slate-900">{quote.name}</div>
                  <div className="text-[10px] text-slate-500 font-medium lowercase">{quote.email}</div>
                </td>
                <td className="px-6 py-5">
                  <div className="font-bold text-slate-700 text-xs">{quote.company_name || "—"}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tight truncate max-w-[200px]">{quote.product_interest || "N/A"}</div>
                </td>
                <td className="px-6 py-5"><StatusBadge status={quote.status} /></td>
                <td className="px-6 py-5 text-slate-500 font-bold text-[10px]">{new Date(quote.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-5 text-right">{expandedId === quote.id ? <ChevronUp size={16} className="ml-auto" /> : <ChevronDown size={16} className="ml-auto" />}</td>
              </tr>
              {expandedId === quote.id && <QuoteDetailRow quote={quote} {...props} />}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    new: "bg-blue-50 text-blue-700 border-blue-200",
    in_progress: "bg-amber-50 text-amber-700 border-amber-200",
    quoted: "bg-green-50 text-green-700 border-green-200",
    closed: "bg-slate-50 text-slate-700 border-slate-200"
  };
  return <span className={`px-2 py-0.5 rounded-sm text-[8px] font-black uppercase tracking-widest border ${colors[status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>{status.replace('_', ' ')}</span>;
}

function LoadingSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-sm shadow-sm overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse h-16 border-b border-slate-100 flex items-center px-6 gap-8">
          <div className="h-4 w-32 bg-slate-100 rounded" /><div className="h-4 w-32 bg-slate-100 rounded" /><div className="h-4 w-16 bg-slate-100 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return <div className="py-20 text-center opacity-40"><Package size={48} className="mx-auto mb-4" /><p className="font-black uppercase tracking-widest text-xs">No quote requests found</p></div>;
}
