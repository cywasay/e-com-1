import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/AdminPageHeader";

export default function BlogHeader({ onCreate }) {
  return (
    <AdminPageHeader
      title="Blog posts"
      description="Manage announcements and editorial content for the storefront."
      actions={
        <Button variant="accent" size="cta" onClick={onCreate}>
          <Plus size={18} />
          Create post
        </Button>
      }
    />
  );
}
