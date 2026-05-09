"use client";

export default function QuotesFilters({ statusFilter, setStatusFilter }) {
  const filters = [
    { id: "all", label: "All Requests" },
    { id: "new", label: "New" },
    { id: "in_progress", label: "In Progress" },
    { id: "quoted", label: "Quoted" },
    { id: "closed", label: "Closed" },
  ];

  return (
    <div className="flex items-center border-b border-slate-200 gap-8 overflow-x-auto scrollbar-hide">
      {filters.map(f => (
        <button
          key={f.id}
          onClick={() => setStatusFilter(f.id)}
          className={`pb-4 text-xs font-black uppercase tracking-widest transition-all relative ${
            statusFilter === f.id ? "text-blue-600" : "text-slate-400 hover:text-slate-600"
          }`}
        >
          {f.label}
          {statusFilter === f.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
        </button>
      ))}
    </div>
  );
}
