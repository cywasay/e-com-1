"use client";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

export default function ProductTags({ formData, setFormData }) {
  const tags = [
    { key: "is_featured", label: "Featured" },
    { key: "is_bestseller", label: "Bestseller" },
    { key: "is_eco_friendly", label: "Eco Friendly" },
    { key: "is_new_arrival", label: "New Arrival" },
  ];

  return (
    <Card className="shadow-sm">
      <CardContent className="p-4">
        <div className="grid grid-cols-2 gap-3">
          {tags.map((tag) => (
            <div key={tag.key} className="flex items-center gap-2">
              <Checkbox
                id={tag.key}
                checked={formData[tag.key]}
                onCheckedChange={(checked) => setFormData({ ...formData, [tag.key]: checked })}
              />
              <Label htmlFor={tag.key} className="text-xs font-medium text-muted-foreground cursor-pointer">
                {tag.label}
              </Label>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
