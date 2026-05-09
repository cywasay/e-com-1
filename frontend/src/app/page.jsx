import HomeClient from "./HomeClient";
import api from "@/lib/api";

export const metadata = {
  title: "Home | uniforms.ae",
  description: "Premium Corporate Uniforms & Workwear in UAE and GCC region.",
};

export default async function HomePage() {
  let products = [];
  let categories = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      api.get("/products"),
      api.get("/categories")
    ]);
    products = productsRes.data?.data?.data || [];
    categories = categoriesRes.data?.data || [];
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }

  return (
    <HomeClient 
      initialProducts={products} 
      initialCategories={categories} 
    />
  );
}

