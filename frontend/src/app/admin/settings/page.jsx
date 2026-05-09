import SettingsClient from "./SettingsClient";

export const metadata = {
  title: "Store Settings | uniforms.ae",
  description: "Configure global store information and social links",
};

export default function SettingsAdminPage() {
  return <SettingsClient />;
}
