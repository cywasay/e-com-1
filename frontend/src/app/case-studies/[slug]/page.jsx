import CaseStudyDetailClient from "./CaseStudyDetailClient";
import api from "@/lib/api";
import { contentExcerpt } from "@/lib/renderContent";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const response = await api.get(`/case-studies/${slug}`);
    const item = response.data;
    return {
      title: `${item.title} | uniforms.ae`,
      description: item.excerpt || contentExcerpt(item.content),
    };
  } catch {
    return { title: "Case Study | uniforms.ae" };
  }
}

export default async function CaseStudyDetailPage({ params }) {
  const { slug } = await params;
  let initialItem = null;

  try {
    const response = await api.get(`/case-studies/${slug}`);
    initialItem = response.data;
  } catch (error) {
    console.error("Error fetching case study:", error);
  }

  return <CaseStudyDetailClient slug={slug} initialItem={initialItem} />;
}
