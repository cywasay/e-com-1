import BlogClient from "./BlogClient";
import api from "@/lib/api";

export const metadata = {
  title: "Insights & Industry News | uniforms.ae",
  description: "Exploring the intersection of technology, textile engineering, and corporate identity.",
};

export default async function BlogPage() {
  let initialPosts = [];

  try {
    const response = await api.get("/blog");
    initialPosts = response.data.data || [];
  } catch (error) {
    console.error("Error fetching blog posts:", error);
  }

  return <BlogClient initialPosts={initialPosts} />;
}
