import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/AdminPageHeader";

export default function CatalogHeader({ onAdd }) {
  return (
    <AdminPageHeader
      title="PDF catalogs"
      description="Upload and manage downloadable product catalogs."
      actions={
        <Button variant="accent" size="cta" onClick={onAdd}>
          <Plus size={16} />
          Add catalog
        </Button>
      }
    />
  );
}
