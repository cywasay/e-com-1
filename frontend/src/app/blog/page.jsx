import BlogClient from "./BlogClient";
import api from "@/lib/api";

export const metadata = {
  title: "Insights & Industry News | uniforms.ae",
  description: "Exploring the intersection of technology, textile engineering, and corporate identity.",
};

export default async function BlogPage() {
  let initialData = null;

  try {
    const response = await api.get("/blog");
    initialData = response.data;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return <BlogClient initialData={initialData} />;
}
