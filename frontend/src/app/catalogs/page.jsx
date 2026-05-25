import CatalogsClient from "./CatalogsClient";
import api from "@/lib/api";

export const metadata = {
  title: "Product Catalogs | uniforms.ae",
  description: "Download PDF product catalogs and collections for corporate uniforms and workwear in the UAE.",
};

export default async function CatalogsPage() {
  let initialCatalogs = [];

  try {
    const response = await api.get("/catalogs");
    initialCatalogs = response.data.data || [];
  } catch (error) {
    console.error("Error fetching catalogs:", error);
  }

  return <CatalogsClient initialCatalogs={initialCatalogs} />;
}
