"use client";
import StatusBadge from "./StatusBadge";

export default function OrdersTable({ orders, isLoading, onSelectOrder }) {
  if (isLoading) return <LoadingSkeleton />;
  if (orders?.length === 0) return <div className="py-20 text-center text-gray-400 italic bg-white border border-gray-200">No orders yet.</div>;

  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      <table className="w-full text-sm text-left border-collapse">
        <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
          <tr>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Order ID</th>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Customer</th>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Type</th>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Items</th>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Total</th>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest">Status</th>
            <th className="px-6 py-3 font-bold uppercase text-[10px] tracking-widest text-right">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((order) => (
            <tr key={order.id} onClick={() => onSelectOrder(order.id)} className="hover:bg-gray-50 cursor-pointer transition-colors">
              <td className="px-6 py-4 font-black text-gray-900">#{order.id}</td>
              <td className="px-6 py-4">
                <div className="font-bold text-gray-700">{order.customer.name}</div>
                <div className="text-[10px] text-gray-400">{order.customer.email}</div>
              </td>
              <td className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">
                {order.buyer_type === 'b2b' ? <span className="text-blue-600 bg-blue-50 px-2 py-0.5 rounded-sm">Wholesale</span> : <span className="text-slate-500 bg-slate-50 px-2 py-0.5 rounded-sm">Retail</span>}
              </td>
              <td className="px-6 py-4 text-gray-600">{order.items?.length || 0} items</td>
              <td className="px-6 py-4 font-black text-gray-900">AED {order.total_amount}</td>
              <td className="px-6 py-4"><StatusBadge status={order.status} /></td>
              <td className="px-6 py-4 text-right text-[10px] text-gray-400 font-bold">{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="bg-white border border-gray-200 rounded-sm shadow-sm overflow-hidden">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="animate-pulse h-16 border-b border-gray-100 flex items-center px-6 gap-8">
          <div className="h-4 w-12 bg-gray-100 rounded" />
          <div className="h-4 w-40 bg-gray-100 rounded" />
          <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
        </div>
      ))}
    </div>
  );
}
