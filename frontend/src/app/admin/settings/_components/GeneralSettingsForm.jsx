"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function GeneralSettingsForm({ register }) {
  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardHeader className="px-8 py-4 bg-gray-50 border-b">
        <h3 className="text-xs font-black text-foreground uppercase tracking-widest">General Information</h3>
      </CardHeader>
      <CardContent className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Store Name" {...register("store_name")} placeholder="uniforms.ae" />
        <Field label="Support Email" {...register("store_email")} placeholder="help@uniforms.ae" />
        <Field label="Store Phone" {...register("store_phone")} placeholder="+971..." />
        <Field label="WhatsApp" {...register("store_whatsapp")} placeholder="+971..." />
        <div className="md:col-span-2 space-y-2">
          <Label className="text-[11px] font-black text-gray-500 uppercase tracking-widest">Store Address</Label>
          <Textarea {...register("store_address")} rows={3} className="resize-none" placeholder="Physical address..." />
        </div>
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
