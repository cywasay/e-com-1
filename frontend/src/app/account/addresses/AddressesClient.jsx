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
import AccountPageHeader from "../_components/AccountPageHeader";
import { parseDefaultAddress } from "@/lib/parseAddress";

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
  const savedAddress = parseDefaultAddress(user?.default_address);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      full_name: savedAddress?.full_name || user?.name || "",
      phone: savedAddress?.phone || user?.phone || "",
      address_line_1: savedAddress?.address_line_1 || "",
      address_line_2: savedAddress?.address_line_2 || "",
      city: savedAddress?.city || "",
      emirates: savedAddress?.emirates || "Dubai",
      country: savedAddress?.country || "United Arab Emirates",
    }
  });

  useEffect(() => {
    const address = parseDefaultAddress(user?.default_address);
    if (address) reset(address);
  }, [user, reset]);

  const mutation = useMutation({
    mutationFn: (data) => api.put("/account/address", data),
    onSuccess: (res) => {
      setUser({ ...user, default_address: parseDefaultAddress(res.data.data) }, token);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  });

  return (
    <div className="max-w-4xl space-y-12">
      <AccountPageHeader
        title="Shipping address"
        description="Manage your default shipping details for faster checkout."
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-20">
        <AddressPreview user={user} isPending={mutation.isPending} />
        <AddressForm 
          register={register} errors={errors} 
          onSubmit={handleSubmit((data) => mutation.mutate(data))} 
          isPending={mutation.isPending} isSuccess={success}
          setValue={setValue}
          watch={watch}
        />
      </div>
    </div>
  );
}
