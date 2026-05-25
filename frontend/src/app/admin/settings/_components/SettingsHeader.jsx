import { Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminPageHeader from "../../_components/AdminPageHeader";

export default function SettingsHeader({ onSave, isPending, isDirty, disabled = false }) {
  return (
    <AdminPageHeader
      title="Store settings"
      description="General configuration, assets, and social links."
      actions={
        <Button
          onClick={onSave}
          disabled={disabled || isPending || !isDirty}
          variant="accent"
          size="cta"
        >
          {isPending ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Save size={16} />
          )}
          Save changes
        </Button>
      }
    />
  );
}
