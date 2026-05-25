"use client";

import AdminFilterTabs from "../../_components/AdminFilterTabs";

export default function QuotesFilters({ statusFilter, setStatusFilter }) {
  const tabs = [
    { value: "all", label: "All requests" },
    { value: "new", label: "New" },
    { value: "in_progress", label: "In progress" },
    { value: "quoted", label: "Quoted" },
    { value: "closed", label: "Closed" },
  ];

  return (
    <AdminFilterTabs
      value={statusFilter}
      onValueChange={setStatusFilter}
      tabs={tabs}
    />
  );
}
