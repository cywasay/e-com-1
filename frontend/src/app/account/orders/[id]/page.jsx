import OrderDetailClient from "./OrderDetailClient";

export async function generateMetadata({ params }) {
  const { id } = await params;
  return {
    title: `Order #${id} | uniforms.ae`,
    description: "View your order details and tracking information.",
  };
}

export default function OrderDetailPage({ params }) {
  return <OrderDetailClient params={params} />;
}
