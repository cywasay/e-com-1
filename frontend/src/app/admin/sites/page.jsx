"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  Loader2,
  Check,
  Store,
  Globe,
  Palette
} from "lucide-react";

export default function SitesPage() {
  const queryClient = useQueryClient();
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    primary_color: "#008060",
    secondary_color: "#000000",
    is_active: true
  });

  // Fetch Sites
  const { data: sitesResponse, isLoading } = useQuery({
    queryKey: ["admin", "sites"],
    queryFn: async () => {
      const response = await api.get("/admin/sites");
      return response.data;
    }
  });

  const sites = sitesResponse?.data || [];

  // Mutations
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (editingSite) {
        return api.put(`/admin/sites/${editingSite.id}`, data);
      }
      return api.post("/admin/sites", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "sites"]);
      handleClear();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return api.delete(`/admin/sites/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin", "sites"]);
    }
  });

  const handleEdit = (site) => {
    setEditingSite(site);
    setFormData({
      name: site.name,
      domain: site.domain,
      primary_color: site.primary_color || "#008060",
      secondary_color: site.secondary_color || "#000000",
      is_active: site.is_active
    });
  };

  const handleClear = () => {
    setEditingSite(null);
    setFormData({
      name: "",
      domain: "",
      primary_color: "#008060",
      secondary_color: "#000000",
      is_active: true
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Sites</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">Manage multi-site architecture and branding</p>
        </div>
        <button 
          onClick={handleClear}
          className="bg-blue-600 text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus size={14} /> Add Site
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Sites List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-widest flex items-center gap-2">
                <Store size={14} />
                Registered Sites
              </h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/50">
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Site Name</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Domain</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Loader2 className="animate-spin mb-2" size={24} />
                          <span className="text-xs font-medium">Loading sites...</span>
                        </div>
                      </td>
                    </tr>
                  ) : sites.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="px-6 py-12 text-center">
                        <p className="text-sm text-slate-400">No sites found. Start by creating one.</p>
                      </td>
                    </tr>
                  ) : (
                    sites.map((site) => (
                      <tr key={site.id} className={`hover:bg-slate-50/50 transition-colors ${editingSite?.id === site.id ? 'bg-blue-50/30' : ''}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: site.primary_color || '#cbd5e1' }}
                            />
                            <span className="text-sm font-bold text-slate-900">{site.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Globe size={12} />
                            <span className="text-xs font-mono">{site.domain}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                            site.is_active 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-slate-100 text-slate-500'
                          }`}>
                            {site.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button 
                              onClick={() => handleEdit(site)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => handleDelete(site.id)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-5 sticky top-24">
          <div className="bg-white border border-slate-200 rounded-md shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
                {editingSite ? 'Edit Site' : 'Create New Site'}
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Site Name
                </label>
                <input 
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors"
                  placeholder="e.g., uniforms.ae"
                />
              </div>

              {/* Domain */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Domain Name
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                  <input 
                    type="text"
                    required
                    value={formData.domain}
                    onChange={(e) => setFormData({...formData, domain: e.target.value})}
                    className="w-full bg-white border border-slate-200 pl-10 pr-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors font-mono"
                    placeholder="example.ae"
                  />
                </div>
              </div>

              {/* Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                      className="w-10 h-10 p-1 bg-white border border-slate-200 rounded cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={formData.primary_color}
                      onChange={(e) => setFormData({...formData, primary_color: e.target.value})}
                      className="flex-1 bg-white border border-slate-200 px-3 py-2 text-xs rounded font-mono uppercase"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                      className="w-10 h-10 p-1 bg-white border border-slate-200 rounded cursor-pointer"
                    />
                    <input 
                      type="text"
                      value={formData.secondary_color}
                      onChange={(e) => setFormData({...formData, secondary_color: e.target.value})}
                      className="flex-1 bg-white border border-slate-200 px-3 py-2 text-xs rounded font-mono uppercase"
                    />
                  </div>
                </div>
              </div>

              {/* Status Toggle */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">
                  Site Status
                </label>
                <div className="flex items-center gap-2 h-[42px]">
                  <button
                    type="button"
                    onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                      formData.is_active ? 'bg-blue-600' : 'bg-slate-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        formData.is_active ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    {formData.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 border-t border-slate-100 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saveMutation.isPending}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 text-xs font-bold uppercase tracking-widest rounded shadow-sm hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {saveMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : editingSite ? (
                    <Check size={14} />
                  ) : (
                    <Plus size={14} />
                  )}
                  {editingSite ? 'Update Site' : 'Create Site'}
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-widest hover:text-slate-800 transition-colors"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          {/* Info Card */}
          <div className="mt-4 p-4 bg-slate-900 border border-slate-800 rounded-md">
            <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Palette size={12} /> Branding Guidelines
            </h4>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Define the site's primary and secondary colors to automatically brand the frontend experience. The domain must be unique and point to this platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
