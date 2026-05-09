"use client";

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <button className="bg-[#008060] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#006e52] transition-colors">
          Add User
        </button>
      </div>

      <div className="bg-white rounded-lg border border-[#E1E3E5] overflow-hidden shadow-sm">
        <div className="p-6 text-center text-gray-500 italic">
          User management table and filters will be implemented here.
        </div>
      </div>
    </div>
  );
}
