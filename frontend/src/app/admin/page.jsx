import DashboardHeader from "./_components/DashboardHeader";
import KPICards from "./_components/KPICards";
import RecentOrders from "./_components/RecentOrders";
import RecentQuotes from "./_components/RecentQuotes";
import InventoryAlerts from "./_components/InventoryAlerts";

export const metadata = {
  title: "Admin Dashboard | uniforms.ae",
  description: "Uniforms.ae Admin Management Dashboard",
};

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <KPICards />
      <div className="grid grid-cols-1 items-stretch gap-6 xl:grid-cols-3">
        <RecentOrders />
        <RecentQuotes />
        <InventoryAlerts />
      </div>
    </div>
  );
}
