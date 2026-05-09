"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import AddressPreview from "./_components/AddressPreview";
import AddressForm from "./_components/AddressForm";

const addressSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  phone: z.string().min(8, "Valid phone number is required"),
  address_line_1: z.string().min(5, "Address is required"),
  address_line_2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  emirates: z.enum(["Dubai", "Abu Dhabi", "Sharjah", "Ajman", "Umm Al Quwain", "Ras Al Khaimah", "Fujairah"], {
    errorMap: () => ({ message: "Please select an emirate" })
  }),
  country: z.string().min(1, "Country is required"),
});

export default function AddressesClient() {
  const { user, setUser, token } = useAuthStore();
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: user?.default_address?.full_name || user?.name || "",
      phone: user?.default_address?.phone || user?.phone || "",
      address_line_1: user?.default_address?.address_line_1 || "",
      address_line_2: user?.default_address?.address_line_2 || "",
      city: user?.default_address?.city || "",
      emirates: user?.default_address?.emirates || "Dubai",
      country: user?.default_address?.country || "United Arab Emirates",
    }
  });

  useEffect(() => {
    if (user?.default_address) reset(user.default_address);
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data) => api.put("/account/address", data),
    onSuccess: (res) => {
      setUser({ ...user, default_address: res.data.data }, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  return (
    <div className="max-w-4xl space-y-20">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Shipping Address</h2>
        <p className="text-[14px] text-[#6b6560] mt-1">Manage your default shipping details for faster checkout.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
        <AddressPreview user={user} isPending={mutation.isPending} />
        <AddressForm 
          register={register} errors={errors} 
          onSubmit={handleSubmit((data) => mutation.mutate(data))} 
          isPending={mutation.isPending} isSuccess={success} 
        />
      </div>
    </div>
  );
}
