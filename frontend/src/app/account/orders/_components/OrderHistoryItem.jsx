"use client";
import { Package, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function OrderHistoryItem({ order }) {
  const getStatusStyle = (s) => {
    switch (s) {
      case 'pending': return "text-amber-600 bg-amber-50";
      case 'processing': return "text-blue-600 bg-blue-50";
      case 'shipped': return "text-purple-600 bg-purple-50";
      case 'delivered': return "text-green-600 bg-green-50";
      case 'cancelled': return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="group bg-white border border-[#e8e4dc] rounded-2xl p-6 transition-all hover:border-[#c8a96e] hover:shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-[#f8f7f4] flex items-center justify-center text-[#1a1a2e] group-hover:bg-[#c8a96e] group-hover:text-white transition-colors">
          <Package size={20} />
        </div>
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[15px] font-bold text-[#1a1a2e]">Order #{order.id}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}>
              {order.status}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-1 text-[13px] text-[#6b6560] font-medium">
            <span className="flex items-center gap-1.5"><Clock size={14} /> {new Date(order.created_at).toLocaleDateString()}</span>
            <span>•</span>
            <span>{order.items_count || 0} items</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-10">
        <div className="text-right">
          <p className="text-[11px] font-bold text-[#6b6560] uppercase tracking-widest mb-0.5">Amount Paid</p>
          <p className="text-[16px] font-black text-[#1a1a2e]">AED {order.total_amount}</p>
        </div>
        
        <Link 
          href={`/account/orders/${order.id}`}
          className="w-10 h-10 rounded-full border border-[#e8e4dc] flex items-center justify-center text-[#6b6560] hover:bg-[#1a1a2e] hover:text-white hover:border-[#1a1a2e] transition-all"
        >
          <ChevronRight size={18} />
        </Link>
      </div>
    </div>
  );
}
