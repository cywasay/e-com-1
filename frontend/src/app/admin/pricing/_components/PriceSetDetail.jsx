"use client";
import { Tag, Loader2, Calendar, Info, Users, Percent, Trash2 } from "lucide-react";

export default function PriceSetDetail({ setDetail, isLoading, onAssign, onAddItem, onRemoveItem }) {
  if (!setDetail && !isLoading) return <EmptyState />;
  if (isLoading) return <div className="bg-white p-20 text-center border border-gray-200 rounded-sm"><Loader2 className="animate-spin inline-block text-blue-600" /></div>;

  return (
    <div className="space-y-8">
      <SetHeader detail={setDetail} />
      <SetAssignments assignments={setDetail.assignments} type={setDetail.type} onAssign={onAssign} />
      <SetOverrides items={setDetail.items} onAddItem={onAddItem} onRemoveItem={onRemoveItem} />
    </div>
  );
}

function EmptyState() {
  return (
    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-xl p-20 text-center space-y-4">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-300"><Tag size={32} /></div>
      <div><p className="text-sm font-bold text-gray-900">No Price Set Selected</p><p className="text-xs text-gray-400">Select a price set to manage overrides.</p></div>
    </div>
  );
}

function SetHeader({ detail }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div><h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{detail.name}</h2><p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{detail.type.replace('_', ' ')}</p></div>
        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${detail.is_active ? "bg-green-50 text-green-600 border-green-200" : "bg-gray-100 text-gray-400 border-gray-200"}`}>{detail.is_active ? "Active" : "Inactive"}</div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <InfoItem icon={<Calendar size={10} />} label="Starts" value={detail.starts_at ? new Date(detail.starts_at).toLocaleDateString() : "Immediate"} />
        <InfoItem icon={<Calendar size={10} />} label="Ends" value={detail.ends_at ? new Date(detail.ends_at).toLocaleDateString() : "Never"} />
        <InfoItem icon={<Info size={10} />} label="Type" value={detail.type} valueClass="text-blue-600" />
      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, valueClass = "" }) {
  return (<div className="space-y-1"><p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">{icon} {label}</p><p className={`text-xs font-bold ${valueClass}`}>{value}</p></div>);
}

function SetAssignments({ assignments, type, onAssign }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"><h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Users size={12} /> Target Audience</h5></div>
      <div className="p-6 space-y-4">
        {assignments?.map(asgn => (<div key={asgn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border border-gray-100"><div><p className="text-xs font-bold text-gray-900">{asgn.scope === 'all_b2b' ? "All Wholesale" : asgn.user?.name}</p><p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{asgn.scope}</p></div></div>))}
        {assignments?.length === 0 && (<div className="py-4 text-center"><button onClick={() => { const scope = type === 'global_sale' ? 'all_b2b' : 'buyer_specific'; const userId = scope === 'buyer_specific' ? prompt("User ID:") : null; onAssign({ scope, user_id: userId }); }} className="text-[10px] font-black uppercase tracking-widest text-blue-600">+ Add Target</button></div>)}
      </div>
    </div>
  );
}

function SetOverrides({ items, onAddItem, onRemoveItem }) {
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50"><h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2"><Percent size={12} /> Overrides</h5><button onClick={() => { const pid = prompt("Product ID:"); const p = prompt("Price:"); if(pid && p) onAddItem({ product_id: pid, override_price: p }); }} className="text-[9px] font-black uppercase tracking-widest text-blue-600">+ Add Product</button></div>
      <table className="w-full text-left text-xs"><thead className="bg-gray-50 text-gray-400 border-b border-gray-100"><tr><th className="px-6 py-3 font-bold uppercase tracking-widest">Product</th><th className="px-6 py-3 font-bold uppercase tracking-widest">Base</th><th className="px-6 py-3 font-bold uppercase tracking-widest text-blue-600">Override</th><th className="px-6 py-3"></th></tr></thead>
        <tbody className="divide-y divide-gray-100">{items?.map(item => (<tr key={item.id} className="hover:bg-gray-50"><td className="px-6 py-4 font-bold text-gray-900">{item.product.name}</td><td className="px-6 py-4 text-gray-400">AED {item.product.base_retail_price}</td><td className="px-6 py-4 font-black text-blue-600">AED {item.override_price}</td><td className="px-6 py-4 text-right"><button onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button></td></tr>))}</tbody>
      </table>
    </div>
  );
}
