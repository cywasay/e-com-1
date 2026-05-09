import CaseStudiesClient from "./CaseStudiesClient";
import api from "@/lib/api";

export const metadata = {
  title: "Proven Results & Success Stories | uniforms.ae",
  description: "Discover how uniforms.ae transforms corporate identities through innovative textile engineering and strategic uniform programs.",
};

export default async function CaseStudiesPage() {
  let initialCaseStudies = [];

  try {
    const response = await api.get("/case-studies");
    initialCaseStudies = response.data.data || [];
  } catch (error) {
    console.error("Error fetching case studies:", error);
  }

  return <CaseStudiesClient initialCaseStudies={initialCaseStudies} />;
}
