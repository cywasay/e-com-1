"use client";
import { Search, Image as ImageIcon, FileText, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";

export default function CatalogTable({ catalogs, isLoading, searchTerm, setSearchTerm, onEdit, onDelete }) {
  if (isLoading) return <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#008060] mx-auto"></div></div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search catalogs..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#008060] outline-none" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-600">
              <th className="p-4 font-medium">Cover</th><th className="p-4 font-medium">Name & Description</th><th className="p-4 font-medium">File</th><th className="p-4 font-medium">Status</th><th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {catalogs.length === 0 ? <tr><td colSpan="5" className="p-8 text-center text-gray-500">No catalogs found.</td></tr> : catalogs.map(catalog => <CatalogRow key={catalog.id} catalog={catalog} onEdit={onEdit} onDelete={onDelete} />)}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CatalogRow({ catalog, onEdit, onDelete }) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="p-4">{catalog.cover_image ? <img src={catalog.cover_image} alt="" className="w-12 h-16 object-cover rounded border border-gray-200" /> : <div className="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400"><ImageIcon size={20} /></div>}</td>
      <td className="p-4"><p className="font-medium text-gray-900">{catalog.name}</p><p className="text-sm text-gray-500 line-clamp-1">{catalog.description}</p></td>
      <td className="p-4"><a href={catalog.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1"><FileText size={14} /> View PDF</a></td>
      <td className="p-4"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${catalog.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{catalog.is_active ? "Active" : "Draft"}</span></td>
      <td className="p-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => onEdit(catalog)} className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button><button onClick={() => onDelete(catalog.id)} className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"><Trash2 size={16} /></button></div></td>
    </tr>
  );
}
