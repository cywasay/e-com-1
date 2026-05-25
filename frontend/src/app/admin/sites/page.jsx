"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useConfirm } from "@/components/ConfirmProvider";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminTableSkeleton from "../_components/skeletons/AdminTableSkeleton";
import AdminPageHeader from "../_components/AdminPageHeader";

export default function SitesPage() {
  const queryClient = useQueryClient();
  const confirm = useConfirm();
  const [editingSite, setEditingSite] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    domain: "",
    primary_color: "#008060",
    secondary_color: "#000000",
    is_active: true
  });

  const { data: sitesResponse, isLoading } = useQuery({
    queryKey: ["admin", "sites"],
    queryFn: async () => {
      const response = await api.get("/admin/sites");
      return response.data;
    }
  });

  const sites = sitesResponse?.data || [];

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
    mutationFn: async (id) => api.delete(`/admin/sites/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["admin", "sites"]),
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

  const handleDelete = async (id) => {
    const confirmed = await confirm({
      title: "Delete site?",
      description: "This site and its assignments will be permanently removed.",
      confirmLabel: "Delete",
      destructive: true,
    });
    if (confirmed) deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Sites"
        description="Manage multi-site architecture and branding."
        actions={
          <Button onClick={handleClear} size="sm">
            <Plus size={14} /> Add site
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-4">
          <Card className="overflow-hidden py-0 shadow-sm">
            <CardHeader className="px-6 py-4 border-b bg-muted">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
                <Store size={14} />
                Registered Sites
              </h3>
            </CardHeader>
            {isLoading ? (
              <AdminTableSkeleton rows={5} columns={4} className="rounded-none border-0 shadow-none" />
            ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Site Name</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Domain</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sites.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="px-6 py-12 text-center text-sm text-muted-foreground">
                      No sites found. Start by creating one.
                    </TableCell>
                  </TableRow>
                ) : (
                  sites.map((site) => (
                    <TableRow key={site.id} className={editingSite?.id === site.id ? "bg-accent/5" : ""}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: site.primary_color || "#cbd5e1" }} />
                          <span className="text-sm font-bold text-foreground">{site.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Globe size={12} />
                          <span className="text-xs font-mono">{site.domain}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={site.is_active ? "default" : "outline"} className="text-[9px] uppercase tracking-wider">
                          {site.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon-sm" onClick={() => handleEdit(site)} title="Edit">
                            <Pencil size={14} />
                          </Button>
                          <Button variant="ghost" size="icon-sm" onClick={() => handleDelete(site.id)} className="hover:text-red-600" title="Delete">
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            )}
          </Card>
        </div>

        <div className="lg:col-span-5 sticky top-24">
          <Card className="overflow-hidden py-0 shadow-sm">
            <CardHeader className="px-6 py-4 border-b bg-muted/50">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">
                {editingSite ? "Edit Site" : "Create New Site"}
              </h3>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Site Name</Label>
                  <Input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., uniforms.ae"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Domain Name</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                    <Input
                      type="text"
                      required
                      value={formData.domain}
                      onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                      className="pl-10 font-mono"
                      placeholder="example.ae"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Primary Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="w-10 h-10 p-1 bg-white border border-border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="flex-1 font-mono uppercase text-xs"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Secondary Color</Label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="w-10 h-10 p-1 bg-white border border-border rounded cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                        className="flex-1 font-mono uppercase text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Site Status</Label>
                  <div className="flex items-center gap-2 h-[42px]">
                    <Switch
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                      {formData.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="pt-6 border-t border-border flex items-center gap-3">
                  <Button type="submit" disabled={saveMutation.isPending} className="flex-1 text-xs font-bold uppercase tracking-widest">
                    {saveMutation.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : editingSite ? (
                      <Check size={14} />
                    ) : (
                      <Plus size={14} />
                    )}
                    {editingSite ? "Update Site" : "Create Site"}
                  </Button>
                  <Button type="button" variant="ghost" onClick={handleClear} className="text-xs font-bold uppercase tracking-widest">
                    Clear
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-4 bg-primary border-primary text-primary-foreground shadow-sm">
            <CardContent className="p-4">
              <h4 className="text-[10px] font-bold text-accent uppercase tracking-widest mb-2 flex items-center gap-2">
                <Palette size={12} /> Branding Guidelines
              </h4>
              <p className="text-[10px] text-primary-foreground/70 leading-relaxed">
                Define the site&apos;s primary and secondary colors to automatically brand the frontend experience. The domain must be unique and point to this platform.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
