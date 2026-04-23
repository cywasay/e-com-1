"use client";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        {[
          { label: "Total Orders", value: "1,245" },
          { label: "Total Revenue", value: "$84,520" },
          { label: "Active Brands", value: "142" },
          { label: "Pending Approvals", value: "12" },
        ].map((kpi, idx) => (
          <motion.div 
            key={idx}
            variants={item}
            className="bg-white border border-[#E1E3E5] p-5 rounded-sm shadow-sm hover:border-[#008060] transition-colors duration-300"
          >
            <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
            <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">{kpi.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white border border-[#E1E3E5] rounded-sm overflow-hidden shadow-sm"
      >
        <div className="px-6 py-4 border-b border-[#E1E3E5]">
          <h3 className="text-sm font-bold text-gray-900">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-[#F6F6F7] text-gray-700 border-b border-[#E1E3E5]">
              <tr>
                <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Order ID</th>
                <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Customer</th>
                <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Date</th>
                <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Status</th>
                <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Total</th>
                <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E1E3E5]">
              {[1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900">#ORD-{1000 + i}</td>
                  <td className="px-6 py-4 text-gray-600">Customer {i}</td>
                  <td className="px-6 py-4 text-gray-600">Oct {10 + i}, 2023</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 rounded-sm text-[11px] font-bold bg-[#E6F4EA] text-[#008060]">
                      Fulfilled
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">${150 + i * 10}.00</td>
                  <td className="px-6 py-4">
                    <button className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
