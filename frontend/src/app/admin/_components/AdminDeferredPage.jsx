import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import AdminPageHeader from "./AdminPageHeader";

export default function AdminDeferredPage({ title, description, phase = "Phase 9" }) {
  return (
    <div className="space-y-6">
      <AdminPageHeader title={title} description={description} />
      <Card>
        <CardContent className="p-10 text-center">
          <Badge variant="secondary" className="mb-3 uppercase tracking-widest">
            {phase}
          </Badge>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            This module is planned for a future phase. It stays out of the main
            navigation until the storefront features it supports are ready.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
