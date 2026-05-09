"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Search, User, Mail, Building2, Calendar, Loader2 } from "lucide-react";

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["admin-customers", search],
    queryFn: () => api.get("/admin/customers", { params: { search } }).then(res => res.data.data),
  });

  const customers = customersData?.data || [];

  return (
    <ProtectedRoute allowedRoles={['super_admin']}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Customers</h1>
            <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Manage your retail and B2B customers</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 border border-slate-200 rounded-md shadow-sm">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Company</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-center">Role</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td className="px-6 py-4">
                        <div className="h-4 w-32 bg-slate-100 rounded mb-1" />
                        <div className="h-3 w-40 bg-slate-100 rounded" />
                      </td>
                      <td className="px-6 py-4"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                      <td className="px-6 py-4"><div className="h-5 w-20 bg-slate-100 rounded-full mx-auto" /></td>
                      <td className="px-6 py-4 text-right"><div className="h-4 w-16 bg-slate-100 rounded ml-auto" /></td>
                    </tr>
                  ))
                ) : customers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <User className="inline-block text-slate-200 mb-2" size={48} />
                      <p className="text-sm font-medium text-slate-400">No customers found.</p>
                    </td>
                  </tr>
                ) : (
                  customers.map((cust) => (
                    <tr key={cust.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900">{cust.name}</div>
                        <div className="text-xs text-slate-500">{cust.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-slate-600">{cust.company_name || "—"}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider inline-block ${
                          cust.role === 'super_admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                          cust.role === 'b2b' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                          'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {cust.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right text-xs text-slate-400 font-medium">
                        {new Date(cust.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
