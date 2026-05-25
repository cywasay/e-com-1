"use client";

import AdminFilterTabs from "../../_components/AdminFilterTabs";

export default function ApplicationsTabs({ status, setStatus }) {
  const tabs = [
    { value: "all", label: "All" },
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  return (
    <AdminFilterTabs
      value={status || "all"}
      onValueChange={(value) => setStatus(value === "all" ? "" : value)}
      tabs={tabs}
    />
  );
}
