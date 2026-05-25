"use client";

import { Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SecurityForm({ register, errors, onSubmit, isPending, isSuccess }) {
  return (
    <section className="space-y-10 border-t border-border pt-10">
      <div>
        <h3 className="text-xl font-bold text-foreground">Security</h3>
        <p className="mt-1 text-sm text-muted-foreground">Update your password.</p>
      </div>
      <form onSubmit={onSubmit} className="space-y-8">
        <div className="max-w-sm space-y-2">
          <Label htmlFor="current_password">Current Password</Label>
          <Input
            id="current_password"
            type="password"
            {...register("current_password")}
            className="rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
            placeholder="••••••••"
            aria-invalid={!!errors.current_password}
          />
          {errors.current_password && (
            <p className="text-[11px] font-medium text-destructive">{errors.current_password.message}</p>
          )}
        </div>
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new_password">New Password</Label>
            <Input
              id="new_password"
              type="password"
              {...register("new_password")}
              className="rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
              placeholder="Min 8 characters"
              aria-invalid={!!errors.new_password}
            />
            {errors.new_password && (
              <p className="text-[11px] font-medium text-destructive">{errors.new_password.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new_password_confirmation">Confirm New Password</Label>
            <Input
              id="new_password_confirmation"
              type="password"
              {...register("new_password_confirmation")}
              className="rounded-none border-0 border-b bg-transparent px-0 shadow-none focus-visible:ring-0"
              placeholder="Confirm"
              aria-invalid={!!errors.new_password_confirmation}
            />
            {errors.new_password_confirmation && (
              <p className="text-[11px] font-medium text-destructive">{errors.new_password_confirmation.message}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-6 pt-4">
          <Button type="submit" disabled={isPending} className="rounded-full px-10">
            {isPending && <Loader2 size={14} className="animate-spin" />} Update password
          </Button>
          {isSuccess && (
            <div className="flex animate-in items-center gap-2 text-[13px] font-medium text-[#2d7a4f] fade-in slide-in-from-left-2">
              <CheckCircle2 size={16} /> Updated
            </div>
          )}
        </div>
      </form>
    </section>
  );
}
