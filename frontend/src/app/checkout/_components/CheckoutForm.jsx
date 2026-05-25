"use client";

import { MapPin, User, Phone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CheckoutForm({ register, errors, onSubmit }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          Shipping Address
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form id="checkout-form" onSubmit={onSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="fullName">Full Name</Label>
            <div className="relative">
              <User className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="fullName" {...register("fullName")} className="pl-10" placeholder="John Doe" aria-invalid={!!errors.fullName} />
            </div>
            {errors.fullName && <p className="text-xs text-destructive">{errors.fullName.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <div className="relative">
              <Phone className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="phone" {...register("phone")} className="pl-10" placeholder="+971..." aria-invalid={!!errors.phone} />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input id="city" {...register("city")} placeholder="Dubai" aria-invalid={!!errors.city} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="addressLine1">Address Line 1</Label>
            <Input id="addressLine1" {...register("addressLine1")} placeholder="Street name..." aria-invalid={!!errors.addressLine1} />
            {errors.addressLine1 && <p className="text-xs text-destructive">{errors.addressLine1.message}</p>}
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="addressLine2">Address Line 2</Label>
            <Input id="addressLine2" {...register("addressLine2")} placeholder="Apartment..." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input id="country" {...register("country")} readOnly className="cursor-not-allowed bg-muted/50 text-muted-foreground" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
