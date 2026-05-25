import CategoryHubClient from "./CategoryHubClient";
import api from "@/lib/api";

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const response = await api.get(`/categories/${slug}`);
    const category = response.data?.data?.category;
    if (!category) {
      return { title: "Category | uniforms.ae" };
    }
    return {
      title: `${category.name} | uniforms.ae`,
      description: `Browse ${category.name} uniforms and workwear at uniforms.ae`,
    };
  } catch {
    return { title: "Category | uniforms.ae" };
  }
}

export default async function CategoryHubPage({ params }) {
  const { slug } = await params;
  let hubData = null;

  try {
    const response = await api.get(`/categories/${slug}`);
    hubData = response.data?.data || null;
  } catch (error) {
    console.error("Error fetching category hub:", error);
  }

  if (!hubData?.category) {
    return (
      <CategoryHubClient
        slug={slug}
        initialData={null}
        notFound
      />
    );
  }

  return (
    <CategoryHubClient
      slug={slug}
      initialData={hubData}
    />
  );
}
