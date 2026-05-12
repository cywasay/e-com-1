import ProductDetailClient from "./ProductDetailClient";
import api from "@/lib/api";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const response = await api.get(`/products/slug/${slug}`);
    const product = response.data.data;
    return {
      title: `${product.name} | uniforms.ae`,
      description: product.description?.substring(0, 160) || "Premium corporate wear & industrial uniforms",
    };
  } catch (error) {
    return {
      title: "Product Detail | uniforms.ae",
    };
  }
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  let initialProduct = null;

  try {
    const response = await api.get(`/products/slug/${slug}`);
    initialProduct = response.data.data;
  } catch (error) {
    console.error("Error fetching product detail:", error);
  }

  return <ProductDetailClient slug={slug} initialProduct={initialProduct} />;
}
