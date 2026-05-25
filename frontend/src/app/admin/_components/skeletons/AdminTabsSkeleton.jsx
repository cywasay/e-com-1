"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminTabsSkeleton({ tabs = 4 }) {
  return (
    <div className="flex gap-6 border-b border-border pb-4 sm:gap-8">
      {[...Array(tabs)].map((_, i) => (
        <Skeleton key={i} className="h-4 w-20" />
      ))}
    </div>
  );
}
