import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/AdminPageHeader";

export default function CaseStudiesHeader({ onAdd }) {
  return (
    <AdminPageHeader
      title="Case studies"
      description="Showcase client success stories and industry expertise."
      actions={
        <Button variant="accent" size="cta" onClick={onAdd}>
          <Plus size={18} />
          Add case study
        </Button>
      }
    />
  );
}
