"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SocialSettingsForm({ register }) {
  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardHeader className="px-8 py-4 bg-gray-50 border-b">
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">Social Media Links</h3>
      </CardHeader>
      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Facebook" {...register("facebook_url")} placeholder="https://..." />
        <Field label="Instagram" {...register("instagram_url")} placeholder="https://..." />
        <Field label="Twitter" {...register("twitter_url")} placeholder="https://..." />
        <Field label="LinkedIn" {...register("linkedin_url")} placeholder="https://..." />
      </CardContent>
    </Card>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <Label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">{label}</Label>
      <Input {...props} />
    </div>
  );
}
