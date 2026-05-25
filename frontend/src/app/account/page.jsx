import AccountDashboardClient from "./AccountDashboardClient";

export const metadata = {
  title: "My Account | uniforms.ae",
  description: "Manage your uniforms.ae account, orders, and quotes.",
};

export default function AccountPage() {
  return <AccountDashboardClient />;
}
