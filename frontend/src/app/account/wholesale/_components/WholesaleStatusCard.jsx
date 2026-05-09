"use client";
import { Truck, CheckCircle, Clock, AlertCircle, Phone } from "lucide-react";
import Link from "next/link";

export default function WholesaleStatusCard({ user }) {
  const b2bStatus = user?.b2b_status || 'none';

  return (
    <div className="bg-white rounded-3xl border border-[#e8e4dc] overflow-hidden shadow-sm">
      <div className="p-8 md:p-10 border-b border-[#f0f0f0] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <StatusIcon status={b2bStatus} />
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-[#6b6560] mb-1">Partnership Level</p>
            <h3 className="text-xl font-bold text-[#1a1a2e]">{getStatusLabel(b2bStatus)}</h3>
          </div>
        </div>
        {b2bStatus === 'approved' && <Badge color="approved">Approved</Badge>}
      </div>

      <div className="p-8 md:p-10">
        <StatusContent status={b2bStatus} user={user} />
      </div>
    </div>
  );
}

function StatusIcon({ status }) {
  const styles = {
    approved: 'bg-[#2d7a4f]/10 text-[#2d7a4f]',
    pending: 'bg-amber-50 text-amber-600',
    rejected: 'bg-red-50 text-red-600',
    none: 'bg-[#f8f7f4] text-[#6b6560]'
  };
  return <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${styles[status] || styles.none}`}><Truck size={32} /></div>;
}

function Badge({ children, color }) {
  return <div className="flex items-center gap-2 px-4 py-2 bg-[#2d7a4f] text-white rounded-full text-[10px] font-black uppercase tracking-widest"><CheckCircle size={14} /> {children}</div>;
}

function getStatusLabel(s) {
  if (s === 'approved') return 'Active Wholesale Partner';
  if (s === 'pending') return 'Application Pending';
  if (s === 'rejected') return 'Application Declined';
  return 'No Active Partnership';
}

function StatusContent({ status, user }) {
  if (status === 'none') return (
    <div className="space-y-6">
      <p className="text-[15px] text-[#6b6560] leading-relaxed">You currently do not have a wholesale account. Approved B2B partners receive access to tiered pricing and bulk tools.</p>
      <Link href="/wholesale" className="inline-block bg-[#1a1a2e] text-white px-10 py-3.5 rounded-full font-bold uppercase tracking-widest text-[11px] hover:bg-[#c8a96e]">Apply for Partnership</Link>
    </div>
  );
  if (status === 'pending') return (
    <div className="flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
      <Clock className="text-amber-600 shrink-0 mt-1" size={20} />
      <div className="space-y-2"><p className="text-[14px] font-bold text-amber-900">Under Review</p><p className="text-[13px] text-amber-700 leading-relaxed">Processing your application. Typically takes 1-2 business days.</p></div>
    </div>
  );
  if (status === 'approved') return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div><p className="text-[10px] font-black uppercase tracking-widest text-[#6b6560]">Company</p><p className="text-[15px] font-bold text-[#1a1a2e]">{user?.company_name || 'Individual'}</p></div>
        <div><p className="text-[10px] font-black uppercase tracking-widest text-[#6b6560]">Benefits</p><p className="text-[15px] font-bold text-[#2d7a4f]">Wholesale Pricing Active</p></div>
      </div>
      <div className="pt-6 border-t border-[#f0f0f0] text-[13px] text-[#6b6560] italic">* Discounts are automatically applied when logged in.</div>
    </div>
  );
  if (status === 'rejected') return (
    <div className="space-y-6">
      <div className="flex items-start gap-4 p-6 bg-red-50 rounded-2xl border border-red-100">
        <AlertCircle className="text-red-600 shrink-0 mt-1" size={20} />
        <div className="space-y-2"><p className="text-[14px] font-bold text-red-900">Update</p><p className="text-[13px] text-red-700 leading-relaxed">Application could not be approved at this time.</p></div>
      </div>
      <Link href="/contact" className="inline-flex items-center gap-2 text-[#1a1a2e] hover:text-[#c8a96e] font-black uppercase tracking-widest text-[11px] transition-colors"><Phone size={14} /> Contact Team</Link>
    </div>
  );
  return null;
}
