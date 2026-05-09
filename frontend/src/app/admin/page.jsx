import DashboardHeader from "./_components/DashboardHeader";
import KPICards from "./_components/KPICards";
import RecentOrders from "./_components/RecentOrders";
import InventoryAlerts from "./_components/InventoryAlerts";

export const metadata = {
  title: "Admin Dashboard | uniforms.ae",
  description: "Uniforms.ae Admin Management Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12 animate-in fade-in duration-700">
      <DashboardHeader />
      <KPICards />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <RecentOrders />
        <InventoryAlerts />
      </div>
    </div>
  );
}
