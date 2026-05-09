"use client";
import { Search } from "lucide-react";

export default function OrdersFilters({ search, setSearch, status, setStatus, buyerType, setBuyerType }) {
  return (
    <div className="bg-white p-4 border border-gray-200 rounded-sm shadow-sm flex flex-wrap gap-4 items-center">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
        <input 
          type="text" placeholder="Search by Order ID..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-50 border-none pl-9 pr-4 py-2 rounded-sm text-xs focus:ring-1 focus:ring-blue-500 outline-none"
        />
      </div>
      <select 
        value={status} onChange={(e) => setStatus(e.target.value)}
        className="bg-gray-50 border-none px-4 py-2 rounded-sm text-xs focus:ring-1 focus:ring-blue-500 outline-none min-w-[140px]"
      >
        <option value="">All Statuses</option>
        <option value="pending">Pending</option>
        <option value="processing">Processing</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
        <option value="cancelled">Cancelled</option>
        <option value="refunded">Refunded</option>
      </select>
      <select 
        value={buyerType} onChange={(e) => setBuyerType(e.target.value)}
        className="bg-gray-50 border-none px-4 py-2 rounded-sm text-xs focus:ring-1 focus:ring-blue-500 outline-none min-w-[140px]"
      >
        <option value="">All Buyer Types</option>
        <option value="b2c">Retail (B2C)</option>
        <option value="b2b">Wholesale (B2B)</option>
      </select>
    </div>
  );
}
