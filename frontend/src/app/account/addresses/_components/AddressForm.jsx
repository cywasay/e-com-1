"use client";

import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMIRATES = ["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"];

export default function AddressForm({ register, errors, onSubmit, isPending, isSuccess, setValue, watch }) {
  const emirates = watch?.("emirates");

  return (
    <div className="space-y-10">
      <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Update Address</h3>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="space-y-6">
          <Field label="Recipient Name" id="full_name" {...register("full_name")} error={errors.full_name} placeholder="Full Name" />
          <Field label="Phone Number" id="phone" {...register("phone")} error={errors.phone} placeholder="+971..." />
          <Field label="Street Address" id="address_line_1" {...register("address_line_1")} error={errors.address_line_1} placeholder="Apt, Villa, Street" />
          <div className="grid grid-cols-2 gap-8">
            <Field label="City" id="city" {...register("city")} error={errors.city} placeholder="City" />
            <div className="space-y-2">
              <Label>Emirate</Label>
              <Select value={emirates || ""} onValueChange={(value) => setValue?.("emirates", value)}>
                <SelectTrigger className="rounded-none border-0 border-b bg-transparent px-0 shadow-none">
                  <SelectValue placeholder="Select emirate" />
                </SelectTrigger>
                <SelectContent>
                  {EMIRATES.map((e) => (
                    <SelectItem key={e} value={e}>{e}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <input type="hidden" {...register("emirates")} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6 pt-4">
          <Button type="submit" disabled={isPending} className="rounded-full px-10">
            {isPending && <Loader2 size={14} className="animate-spin" />} Save address
          </Button>
          {isSuccess && (
            <div className="flex animate-in items-center gap-2 text-[13px] font-medium text-[#2d7a4f] fade-in slide-in-from-left-2">
              <CheckCircle2 size={16} /> Saved
            </div>
          )}
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, id, ...props }) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        {...props}
        className="rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
        aria-invalid={!!error}
      />
      {error && <p className="text-[11px] font-medium text-destructive">{error.message}</p>}
    </div>
  );
}
