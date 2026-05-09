"use client";
import { Search } from "lucide-react";

export default function ProductsFilters({ search, setSearch, statusFilter, setStatusFilter, categoryFilter, setCategoryFilter, categoryOptions }) {
  return (
    <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm flex flex-col md:flex-row gap-4 items-center">
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
        <input 
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="flex-1 md:w-40 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-600 uppercase tracking-wider focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="archived">Archived</option>
        </select>
        <select 
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="flex-1 md:w-56 px-3 py-2 bg-slate-50 border border-slate-200 rounded text-xs font-bold text-slate-600 uppercase tracking-wider focus:outline-none"
        >
          <option value="">All Categories</option>
          {categoryOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
