"use client";

export default function ApplicationsTabs({ status, setStatus }) {
  const tabs = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Approved", value: "approved" },
    { label: "Rejected", value: "rejected" }
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map((tab) => (
        <button
          key={tab.label}
          onClick={() => setStatus(tab.value)}
          className={`px-6 py-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
            status === tab.value 
              ? "border-blue-600 text-blue-600 bg-blue-50/50" 
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
