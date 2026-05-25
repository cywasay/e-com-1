"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPageHeaderSkeleton({ showAction = false }) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>
      {showAction && <Skeleton className="h-9 w-32" />}
    </div>
  );
}
