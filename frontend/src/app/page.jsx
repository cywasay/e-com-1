import HomeClient from "./HomeClient";
import api from "@/lib/api";

export const metadata = {
  title: "Premium Corporate Uniforms & Workwear | uniforms.ae",
  description: "Premium corporate uniforms and workwear for organizations across the UAE and GCC. Browse catalogs, request quotes, and apply for wholesale accounts.",
};

export default async function HomePage() {
  let products = [];
  let categories = [];
  let blogPosts = [];
  let caseStudies = [];

  try {
    const [productsRes, categoriesRes, blogRes, casesRes] = await Promise.all([
      api.get("/products", { params: { is_featured: 1, per_page: 8 } }),
      api.get("/categories"),
      api.get("/blog", { params: { page: 1 } }),
      api.get("/case-studies", { params: { page: 1 } }),
    ]);
    products = productsRes.data?.data?.data || [];
    categories = categoriesRes.data?.data || [];
    blogPosts = (blogRes.data?.data || []).slice(0, 3);
    caseStudies = (casesRes.data?.data || []).slice(0, 2);
  } catch (error) {
    console.error("Error fetching home page data:", error);
  }

  return (
    <HomeClient
      initialProducts={products}
      initialCategories={categories}
      initialBlogPosts={blogPosts}
      initialCaseStudies={caseStudies}
    />
  );
}

