"use client";

import useAuthStore from "@/store/authStore";
import WholesaleStatusCard from "./_components/WholesaleStatusCard";

export default function WholesaleClient() {
  const { user } = useAuthStore();

  return (
    <div className="max-w-3xl space-y-12">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e]">Wholesale Status</h2>
        <p className="text-[14px] text-[#6b6560] mt-1">Review your business partnership standing and wholesale privileges.</p>
      </div>

      <WholesaleStatusCard user={user} />
    </div>
  );
}
