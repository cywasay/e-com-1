"use client";

import AdminPageHeaderSkeleton from "./AdminPageHeaderSkeleton";
import AdminTabsSkeleton from "./AdminTabsSkeleton";
import AdminTableSkeleton from "./AdminTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminListPageSkeleton({
  showTabs = false,
  tabCount = 4,
  showFilters = false,
  tableColumns = 5,
  tableRows = 6,
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeaderSkeleton showAction />
      {showTabs && <AdminTabsSkeleton tabs={tabCount} />}
      {showFilters && (
        <div className="flex flex-wrap gap-3">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-40" />
        </div>
      )}
      <AdminTableSkeleton rows={tableRows} columns={tableColumns} />
    </div>
  );
}
