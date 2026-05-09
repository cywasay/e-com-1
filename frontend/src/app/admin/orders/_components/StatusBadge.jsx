export default function StatusBadge({ status }) {
  const getStatusColor = (s) => {
    switch (s) {
      case 'pending': return "bg-amber-50 text-amber-700 border-amber-200";
      case 'processing': return "bg-blue-50 text-blue-700 border-blue-200";
      case 'shipped': return "bg-purple-50 text-purple-700 border-purple-200";
      case 'delivered': return "bg-green-50 text-green-700 border-green-200";
      case 'cancelled': return "bg-red-50 text-red-700 border-red-200";
      case 'refunded': return "bg-slate-50 text-slate-700 border-slate-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <span className={`px-2 py-0.5 rounded-sm text-[9px] font-black uppercase tracking-widest border ${getStatusColor(status)}`}>
      {status}
    </span>
  );
}
