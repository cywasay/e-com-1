"use client";

import useAuthStore from "@/store/authStore";
import WholesaleStatusCard from "./_components/WholesaleStatusCard";
import AccountPageHeader from "../_components/AccountPageHeader";

export default function WholesaleClient() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-3xl space-y-10">
      <AccountPageHeader
        title="Wholesale status"
        description="Review your business partnership standing and wholesale privileges."
      />

      <WholesaleStatusCard user={user} />
    </div>
  );
}
