"use client";

import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileInfoForm({ user, register, errors, onSubmit, isPending, isSuccess }) {
  return (
    <section className="space-y-10">
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
          {!user ? (
            <LoadingFields />
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  {...register("name")}
                  className="rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                  placeholder="Your Name"
                  aria-invalid={!!errors.name}
                />
                {errors.name && <p className="text-[11px] font-medium text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <div className="border-b border-border/50 py-2 text-sm text-muted-foreground italic">{user?.email}</div>
              </div>
              {user?.role === "b2b_buyer" && (
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="company_name">Company Name</Label>
                  <Input
                    id="company_name"
                    {...register("company_name")}
                    className="rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
                    placeholder="Company LLC"
                  />
                </div>
              )}
            </>
          )}
        </div>
        <div className="flex items-center gap-6 pt-4">
          <Button type="submit" disabled={isPending} className="rounded-full px-10">
            {isPending && <Loader2 size={14} className="animate-spin" />} Save changes
          </Button>
          {isSuccess && (
            <div className="flex animate-in items-center gap-2 text-[13px] font-medium text-[#2d7a4f] fade-in slide-in-from-left-2">
              <CheckCircle2 size={16} /> Saved
            </div>
          )}
        </div>
      </form>
    </section>
  );
}

function LoadingFields() {
  return [...Array(3)].map((_, i) => (
    <div key={i} className="space-y-4">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
  ));
}
