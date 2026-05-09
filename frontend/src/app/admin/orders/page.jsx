import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Order Management | uniforms.ae",
  description: "Manage and fulfill customer orders",
};

export default function OrdersPage() {
  return <OrdersClient />;
}
