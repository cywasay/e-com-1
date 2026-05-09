import CatalogPageClient from "./CatalogPageClient";
import api from "@/lib/api";

export const metadata = {
  title: "Product Catalog | uniforms.ae",
  description: "Browse our premium corporate wear & industrial uniforms",
};

export default async function CatalogPage() {
  let initialProducts = [];
  let initialCategories = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories")
    ]);
    initialProducts = productsRes.data.data.data || [];
    initialCategories = categoriesRes.data.data || [];
  } catch (error) {
    console.error("Error fetching catalog data:", error);
  }

  return (
    <CatalogPageClient 
      initialProducts={initialProducts} 
      initialCategories={initialCategories} 
    />
  );
}
