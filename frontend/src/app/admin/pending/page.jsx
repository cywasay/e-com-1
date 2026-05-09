"use client";

export default function PendingApprovalsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pending Brand Approvals</h1>
      </div>

      <div className="bg-white rounded-lg border border-[#E1E3E5] overflow-hidden shadow-sm">
        <div className="p-6 text-center text-gray-500 italic">
          List of brands awaiting administrative approval to join uniforms.ae.
        </div>
      </div>
    </div>
  );
}
