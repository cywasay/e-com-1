import AdminPageHeaderSkeleton from "../_components/skeletons/AdminPageHeaderSkeleton";
import AdminFormSkeleton from "../_components/skeletons/AdminFormSkeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-4xl space-y-8 pb-20">
      <AdminPageHeaderSkeleton showAction />
      <AdminFormSkeleton sections={3} fields={3} />
    </div>
  );
}
