"use client";

export default function SuspendedBrandsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Suspended Brands</h1>
      </div>

      <div className="bg-white rounded-lg border border-[#E1E3E5] overflow-hidden shadow-sm">
        <div className="p-6 text-center text-gray-500 italic">
          Manage and review brands that have been suspended from uniforms.ae.
        </div>
      </div>
    </div>
  );
}
