"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AssetsSettingsForm({ register }) {
  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardHeader className="px-8 py-4 bg-gray-50 border-b">
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Assets & Logos</h3>
      </CardHeader>
      <CardContent className="p-8">
        <div className="space-y-2">
          <Label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Logo URL</Label>
          <Input {...register("store_logo_url")} placeholder="URL to your store logo" />
        </div>
      </CardContent>
    </Card>
  );
}
