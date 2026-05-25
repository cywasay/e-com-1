import BlogPostClient from "./BlogPostClient";
import api from "@/lib/api";
import { contentExcerpt } from "@/lib/renderContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await api.get(`/blog/${slug}`);
    const post = response.data;
    return {
      title: `${post.title} | uniforms.ae`,
      description: post.excerpt || contentExcerpt(post.content),
    };
  } catch {
    return { title: "Blog | uniforms.ae" };
  }
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  let initialPost = null;

  try {
    const response = await api.get(`/blog/${slug}`);
    initialPost = response.data;
  } catch (error) {
    console.error("Error fetching blog post:", error);
  }

  return <BlogPostClient slug={slug} initialPost={initialPost} />;
}
