"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import useAuthStore from "@/store/authStore";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import ProfileInfoForm from "./_components/ProfileInfoForm";
import SecurityForm from "./_components/SecurityForm";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  company_name: z.string().optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(8, "New password must be at least 8 characters"),
  new_password_confirmation: z.string()
}).refine((data) => data.new_password === data.new_password_confirmation, {
  message: "Passwords do not match",
  path: ["new_password_confirmation"],
});

export default function ProfileClient() {
  const { user, setUser, token } = useAuthStore();
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const { register: registerProfile, handleSubmit: handleSubmitProfile, reset: resetProfile, formState: { errors: profileErrors } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name || "", company_name: user?.company_name || "" }
  });

  const { register: registerPassword, handleSubmit: handleSubmitPassword, reset: resetPassword, formState: { errors: passwordErrors } } = useForm({
    resolver: zodResolver(passwordSchema)
  });

  useEffect(() => {
    if (user) resetProfile({ name: user.name, company_name: user.company_name || "" });
  }, [user, resetProfile]);

  const profileMutation = useMutation({
    mutationFn: (data) => api.put("/account/profile", data),
    onSuccess: (res) => {
      setUser(res.data.data, token);
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    }
  });

  const passwordMutation = useMutation({
    mutationFn: (data) => api.put("/account/profile", { ...data, name: user.name }),
    onSuccess: () => {
      resetPassword();
      setPasswordSuccess(true);
      setTimeout(() => setPasswordSuccess(false), 3000);
    }
  });

  return (
    <div className="max-w-3xl space-y-20">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Profile Settings</h2>
        <p className="text-[14px] text-[#6b6560] mt-1">Manage your account identity and company details.</p>
      </div>

      <ProfileInfoForm 
        user={user} register={registerProfile} errors={profileErrors} 
        onSubmit={handleSubmitProfile((data) => profileMutation.mutate(data))} 
        isPending={profileMutation.isPending} isSuccess={profileSuccess} 
      />

      <SecurityForm 
        register={registerPassword} errors={passwordErrors} 
        onSubmit={handleSubmitPassword((data) => passwordMutation.mutate(data))} 
        isPending={passwordMutation.isPending} isSuccess={passwordSuccess} 
      />
    </div>
  );
}
