"use client";

import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function RegisterForm({
  register,
  errors,
  isSubmitting,
  onSubmit,
  serverError,
  selectedRole,
}) {
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label>Account Type</Label>
        <div className="grid grid-cols-2 gap-4">
          <RoleOption label="Individual" value="b2c_customer" active={selectedRole === "b2c_customer"} register={register} />
          <RoleOption label="Corporate (B2B)" value="b2b_buyer" active={selectedRole === "b2b_buyer"} register={register} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Full Name" {...register("name")} error={errors.name} placeholder="John Doe" />
        <Field label="Phone" {...register("phone")} error={errors.phone} placeholder="+971..." />
      </div>

      <Field label="Email Address" {...register("email")} error={errors.email} placeholder="you@company.com" />

      {selectedRole === "b2b_buyer" && (
        <div className="grid grid-cols-1 gap-5 rounded-md border border-border bg-muted p-4 md:grid-cols-2">
          <Field
            label="Company Name *"
            {...register("company_name")}
            error={errors.company_name}
            placeholder="Company LLC"
          />
          <Field
            label="TRN / Tax ID *"
            {...register("tax_id")}
            error={errors.tax_id}
            placeholder="1000..."
          />
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <PasswordField
          label="Password"
          {...register("password")}
          error={errors.password}
          show={showPass}
          setShow={setShowPass}
        />
        <PasswordField
          label="Confirm Password"
          {...register("password_confirmation")}
          error={errors.password_confirmation}
          show={showConf}
          setShow={setShowConf}
        />
      </div>

      <Button type="submit" variant="accent" size="cta" disabled={isSubmitting} className="mt-4 w-full">
        {isSubmitting ? (
          <>
            <Loader2 size={16} className="animate-spin" /> Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}

function RoleOption({ label, value, active, register }) {
  return (
    <label className="cursor-pointer">
      <input type="radio" value={value} {...register("role")} className="hidden" />
      <Button
        type="button"
        variant={active ? "default" : "outline"}
        className="pointer-events-none w-full"
        tabIndex={-1}
      >
        {label}
      </Button>
    </label>
  );
}

function Field({ label, error, id, ...props }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <Input id={fieldId} {...props} aria-invalid={!!error} />
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}

function PasswordField({ label, error, show, setShow, id, ...props }) {
  const fieldId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-2">
      <Label htmlFor={fieldId}>{label}</Label>
      <div className="relative">
        <Input
          id={fieldId}
          type={show ? "text" : "password"}
          {...props}
          className="pr-10"
          placeholder="••••••••"
          aria-invalid={!!error}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          onClick={() => setShow(!show)}
          className="absolute top-1/2 right-2 -translate-y-1/2 text-muted-foreground"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </Button>
      </div>
      {error && <p className="text-sm text-destructive">{error.message}</p>}
    </div>
  );
}
