"use client";
import { Pencil, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductsTable({ products, isLoading, onEdit, onDelete, page, setPage, lastPage }) {
  if (isLoading) return <LoadingSkeleton />;
  if (products.length === 0) return <EmptyState />;

  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest w-1/3">Product</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Price</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <ProductRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} setPage={setPage} lastPage={lastPage} />
    </div>
  );
}

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-slate-50 transition-colors group">
      <td className="px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{product.name}</span>
          <div className="flex flex-wrap gap-1.5">
            {product.is_featured && <Badge color="amber">Featured</Badge>}
            {product.is_bestseller && <Badge color="purple">Bestseller</Badge>}
            {product.is_eco_friendly && <Badge color="green">Eco Friendly</Badge>}
            {product.is_new_arrival && <Badge color="blue">New</Badge>}
          </div>
        </div>
      </td>
      <td className="px-6 py-4">
        <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
          {product.category?.name || "Uncategorized"}
        </span>
      </td>
      <td className="px-6 py-4">
        <span className="text-sm font-bold text-slate-900">AED {product.price || "0.00"}</span>
      </td>
      <td className="px-6 py-4 text-center">
        <StatusBadge status={product.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => onEdit(product)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Pencil size={14} /></button>
          <button onClick={() => onDelete(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={14} /></button>
        </div>
      </td>
    </tr>
  );
}

function Badge({ children, color }) {
  const colors = {
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    green: "bg-green-50 text-green-700 border-green-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100"
  };
  return <span className={`px-1.5 py-0.5 rounded-sm border text-[8px] font-bold uppercase tracking-widest ${colors[color]}`}>{children}</span>;
}

function StatusBadge({ status }) {
  const colors = {
    published: 'bg-green-50 text-green-700 border-green-200',
    archived: 'bg-slate-100 text-slate-600 border-slate-200',
    draft: 'bg-blue-50 text-blue-700 border-blue-200'
  };
  return <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${colors[status] || colors.draft}`}>{status}</span>;
}

function Pagination({ page, setPage, lastPage }) {
  if (lastPage <= 1) return null;
  return (
    <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Page {page} of {lastPage}</span>
      <div className="flex items-center gap-2">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} className="p-2 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"><ChevronLeft size={16} /></button>
        <button disabled={page === lastPage} onClick={() => setPage(page + 1)} className="p-2 border border-slate-200 rounded bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-50 transition-colors"><ChevronRight size={16} /></button>
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="px-6 py-4 animate-pulse border-b border-slate-100 flex justify-between">
          <div className="h-4 w-40 bg-slate-100 rounded" />
          <div className="h-4 w-20 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-20 text-center bg-white border border-slate-200 rounded-md">
      <Package className="inline-block text-slate-200 mb-2" size={48} />
      <p className="text-sm font-medium text-slate-400">No products found matches your criteria.</p>
    </div>
  );
}
