"use client";

import AdminPageHeaderSkeleton from "./AdminPageHeaderSkeleton";
import AdminPanelSkeleton from "./AdminPanelSkeleton";
import AdminFormSkeleton from "./AdminFormSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function AdminSplitPageSkeleton({
  showAction = false,
  gridCols = "lg:grid-cols-3",
  leftSpan = "lg:col-span-1",
  rightSpan = "lg:col-span-2",
  rightType = "panel",
  listItems = 4,
}) {
  return (
    <div className="space-y-6">
      <AdminPageHeaderSkeleton showAction={showAction} />
      <div className={`grid grid-cols-1 items-start gap-8 ${gridCols}`}>
        <div className={leftSpan}>
          <Skeleton className="mb-4 h-3 w-40" />
          <Card className="divide-y divide-border overflow-hidden py-0 shadow-sm">
            {[...Array(listItems)].map((_, i) => (
              <div key={i} className="space-y-2 p-4">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            ))}
          </Card>
        </div>
        <div className={rightSpan}>
          {rightType === "form" ? (
            <AdminFormSkeleton sections={1} fields={3} />
          ) : (
            <AdminPanelSkeleton sections={2} />
          )}
        </div>
      </div>
    </div>
  );
}
