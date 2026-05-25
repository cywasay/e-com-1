import AdminSplitPageSkeleton from "../_components/skeletons/AdminSplitPageSkeleton";

export default function SitesLoading() {
  return (
    <AdminSplitPageSkeleton
      showAction
      gridCols="lg:grid-cols-12"
      leftSpan="lg:col-span-7"
      rightSpan="lg:col-span-5"
      rightType="form"
      listItems={4}
    />
  );
}
