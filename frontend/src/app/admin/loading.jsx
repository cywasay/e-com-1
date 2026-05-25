import AdminPageHeaderSkeleton from "./_components/skeletons/AdminPageHeaderSkeleton";
import AdminTableSkeleton from "./_components/skeletons/AdminTableSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-8">
      <AdminPageHeaderSkeleton />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[132px] rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <AdminTableSkeleton rows={5} columns={4} showHeader />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[420px] rounded-xl" />
          <Skeleton className="h-[420px] rounded-xl" />
        </div>
      </div>
    </div>
  );
}
