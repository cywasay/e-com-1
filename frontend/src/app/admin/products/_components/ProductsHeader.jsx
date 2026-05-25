import { Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/AdminPageHeader";

export default function ProductsHeader({ onAdd, onImport }) {
  return (
    <AdminPageHeader
      title="Products"
      description="Manage catalog items, variants, pricing, and inventory."
      actions={
        <>
          <Button variant="outline" onClick={onImport}>
            <Upload size={16} />
            Bulk import
          </Button>
          <Button variant="accent" size="cta" onClick={onAdd}>
            <Plus size={16} />
            Add product
          </Button>
        </>
      }
    />
  );
}
