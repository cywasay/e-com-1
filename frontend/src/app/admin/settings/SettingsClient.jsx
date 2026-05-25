"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { toast } from "react-hot-toast";
import SettingsHeader from "./_components/SettingsHeader";
import GeneralSettingsForm from "./_components/GeneralSettingsForm";
import SocialSettingsForm from "./_components/SocialSettingsForm";
import AssetsSettingsForm from "./_components/AssetsSettingsForm";
import AdminFormSkeleton from "../_components/skeletons/AdminFormSkeleton";

export default function SettingsClient() {
  const queryClient = useQueryClient();

  const { data: settingsData, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: () => api.get("/admin/settings").then((res) => res.data.data),
  });

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm();

  useEffect(() => {
    if (settingsData) reset(settingsData);
  }, [settingsData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => api.put("/admin/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-settings"]);
      toast.success("Settings saved successfully");
    },
    onError: () => toast.error("Failed to save settings"),
  });

  return (
    <ProtectedRoute allowedRoles={["super_admin"]}>
      <div className="max-w-4xl space-y-8 pb-20">
        {isLoading ? (
          <>
            <SettingsHeader onSave={() => {}} isPending={false} isDirty={false} disabled />
            <AdminFormSkeleton sections={3} fields={3} />
          </>
        ) : (
          <>
            <SettingsHeader
              onSave={handleSubmit((data) => mutation.mutate(data))}
              isPending={mutation.isPending}
              isDirty={isDirty}
            />
            <form onSubmit={handleSubmit((data) => mutation.mutate(data))} className="space-y-8">
              <GeneralSettingsForm register={register} />
              <SocialSettingsForm register={register} />
              <AssetsSettingsForm register={register} />
            </form>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
