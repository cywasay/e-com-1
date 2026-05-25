"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import useCartStore from "@/store/cartStore";
import useAuthStore from "@/store/authStore";
import ProtectedRoute from "@/components/ProtectedRoute";
import StorefrontLayout from "@/components/StorefrontLayout";
import { useState } from "react";
import CheckoutForm from "./_components/CheckoutForm";
import OrderSummary from "./_components/OrderSummary";
import EmptyCartView from "./_components/EmptyCartView";
import { Alert, AlertDescription } from "@/components/ui/alert";

const schema = z.object({
  fullName: z.string().min(3, "Full name is required"),
  phone: z.string().min(10, "Phone number is required"),
  addressLine1: z.string().min(5, "Address is required"),
  addressLine2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required").default("UAE"),
});

export default function CheckoutClient() {
  const { items, getCartTotal } = useCartStore();
  const { user } = useAuthStore();
  const [error, setError] = useState(null);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: user?.name || "",
      phone: "",
      addressLine1: "",
      addressLine2: "",
      city: "",
      country: "UAE",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await api.post("/checkout/session", {
        items: items.map(item => ({
          product_id: item.product_id,
          variant_id: item.variant_id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: data,
      });
      return response.data;
    },
    onSuccess: (data) => {
      if (data.data.checkout_url) window.location.href = data.data.checkout_url;
    },
    onError: (err) => setError(err.response?.data?.message || "Failed to initiate checkout"),
  });

  if (items.length === 0) return <EmptyCartView />;

  return (
    <ProtectedRoute>
      <StorefrontLayout>
        <div className="page-container py-12">
          <h1 className="section-heading mb-8">Checkout</h1>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-8">
              <CheckoutForm register={register} errors={errors} onSubmit={handleSubmit((data) => mutation.mutate(data))} />
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
            <OrderSummary items={items} total={getCartTotal()} isPending={mutation.isPending} />
          </div>
        </div>
      </StorefrontLayout>
    </ProtectedRoute>
  );
}
