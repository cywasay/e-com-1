"use client";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductSiteSelect({ sites, selectedSiteIds, onChange }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 gap-3">
          {sites.length === 0 ? (
            <p className="text-[10px] text-muted-foreground italic">No sites available</p>
          ) : (
            sites.map((site) => (
              <div key={site.id} className="flex items-center gap-3">
                <Checkbox
                  id={`site-${site.id}`}
                  checked={selectedSiteIds.includes(site.id)}
                  onCheckedChange={(checked) => {
                    const newSiteIds = checked
                      ? [...selectedSiteIds, site.id]
                      : selectedSiteIds.filter((id) => id !== site.id);
                    onChange(newSiteIds);
                  }}
                />
                <Label htmlFor={`site-${site.id}`} className="flex flex-col cursor-pointer">
                  <span className="text-xs font-bold text-foreground">{site.name}</span>
                  <span className="text-[9px] text-muted-foreground font-mono tracking-tight">{site.domain}</span>
                </Label>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
