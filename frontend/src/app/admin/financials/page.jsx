export default function AdminFinancials() {
  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm shadow-sm">
          <div className="text-2xl font-bold text-gray-900">$124,500.00</div>
          <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Gross Volume</div>
        </div>
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm shadow-sm">
          <div className="text-2xl font-bold text-gray-900">$12,450.00</div>
          <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Platform Fees</div>
        </div>
        <div className="bg-white border border-[#E1E3E5] p-5 rounded-sm shadow-sm">
          <div className="text-2xl font-bold text-gray-900">$112,050.00</div>
          <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wider">Net Payouts</div>
        </div>
      </div>

      <div className="bg-white border border-[#E1E3E5] rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E1E3E5]">
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Transactions</h3>
        </div>
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#F6F6F7] text-gray-700 border-b border-[#E1E3E5]">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Transaction ID</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Type</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Amount</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E3E5]">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">#TXN-{9000 + i}</td>
                <td className="px-6 py-4 text-gray-600">Payout</td>
                <td className="px-6 py-4 font-medium text-[#008060]">${1000 + i * 500}.00</td>
                <td className="px-6 py-4 text-gray-600">Nov {15 + i}, 2023</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
