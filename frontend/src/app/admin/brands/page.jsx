export default function AdminBrands() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">All Brands</h3>
        <button className="bg-[#008060] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-sm shadow-sm hover:bg-[#006e52] transition-colors">
          Add Brand
        </button>
      </div>
      
      <div className="bg-white border border-[#E1E3E5] rounded-sm shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="bg-[#F6F6F7] text-gray-700 border-b border-[#E1E3E5]">
            <tr>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Brand ID</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Name</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider">Status</th>
              <th className="px-6 py-3 font-semibold uppercase text-[11px] tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E1E3E5]">
            {[1, 2, 3].map((i) => (
              <tr key={i} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">#BRD-{100 + i}</td>
                <td className="px-6 py-4 text-gray-600">Brand Name {i}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold bg-[#E6F4EA] text-[#008060] uppercase tracking-wide">
                    Active
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="text-[11px] font-bold uppercase tracking-wider text-gray-500 hover:text-[#008060] transition-colors">
                    Edit
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
