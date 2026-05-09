import OrdersClient from "./OrdersClient";

export const metadata = {
  title: "Order History | uniforms.ae",
  description: "Track your recent orders and download invoices",
};

export default function OrderHistoryPage() {
  return <OrdersClient />;
}
