"use client";
import { Search, Briefcase, Building2, Tag as TagIcon, CheckCircle2, Clock, Edit2, Trash2, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function CaseStudiesTable({ cases, isLoading, searchQuery, setSearchQuery, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input type="text" placeholder="Filter by title or client..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 outline-none text-sm" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-b border-slate-100">
              <th className="px-6 py-4">Title & Client</th><th className="px-6 py-4">Industry</th><th className="px-6 py-4">Status</th><th className="px-6 py-4">Date</th><th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? <tr><td colSpan="5" className="px-6 py-12 text-center"><Loader2 className="animate-spin mx-auto text-blue-600" /></td></tr> : cases.length === 0 ? <tr><td colSpan="5" className="px-6 py-12 text-center text-slate-500">No case studies found.</td></tr> : cases.map(item => <CaseRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CaseRow({ item, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-slate-50/80 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 border border-slate-100 overflow-hidden">
            {item.featured_image ? <img src={item.featured_image} alt="" className="w-full h-full object-cover" /> : <Briefcase size={20} />}
          </div>
          <div><p className="font-bold text-slate-900 leading-tight">{item.title}</p><p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1"><Building2 size={10} /> {item.client_name || 'Anonymous'}</p></div>
        </div>
      </td>
      <td className="px-6 py-4"><span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider"><TagIcon size={10} /> {item.industry || 'General'}</span></td>
      <td className="px-6 py-4">{item.status === 'published' ? <Badge color="emerald"><CheckCircle2 size={12} /> Published</Badge> : <Badge color="amber"><Clock size={12} /> Draft</Badge>}</td>
      <td className="px-6 py-4 text-xs text-slate-500 font-medium">{format(new Date(item.created_at), "MMM d, yyyy")}</td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(item)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit2 size={16} /></button>
          <button onClick={() => onDelete(item.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  );
}

function Badge({ children, color }) {
  const colors = { emerald: "bg-emerald-50 text-emerald-600 border-emerald-100", amber: "bg-amber-50 text-amber-600 border-amber-100" };
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${colors[color]}`}>{children}</span>;
}
