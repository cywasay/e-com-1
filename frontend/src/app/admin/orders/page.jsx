export default function AdminOrders() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">All Orders</h3>
        <div className="flex space-x-3">
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="border border-[#E1E3E5] px-3 py-1.5 text-sm rounded-sm focus:outline-none focus:border-[#008060] bg-white"
          />
          <button className="bg-white border border-[#E1E3E5] text-gray-700 px-4 py-1.5 text-xs font-bold uppercase tracking-wider rounded-sm hover:bg-gray-50 transition-colors">
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E1E3E5] rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#F6F6F7] text-gray-700 border-b border-[#E1E3E5]">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Order ID</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Customer</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Date</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Status</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Total</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E3E5]">
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">#ORD-{2000 + i}</td>
                <td className="px-6 py-4 text-gray-600">Jane Doe {i}</td>
                <td className="px-6 py-4 text-gray-600">Nov {10 + i}, 2023</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-[#FFF4E5] text-[#B98900] uppercase tracking-wide">
                    Pending
                  </span>
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">${200 + i * 20}.00</td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#008060] transition-colors">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
