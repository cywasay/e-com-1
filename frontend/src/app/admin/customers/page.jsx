"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { Search, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AdminTableSkeleton from "../_components/skeletons/AdminTableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AdminPageHeader from "../_components/AdminPageHeader";

function formatRole(role) {
  switch (role) {
    case "b2b_buyer":
      return "B2B buyer";
    case "b2c_customer":
      return "B2C customer";
    case "admin_staff":
      return "Admin staff";
    case "super_admin":
      return "Super admin";
    default:
      return role?.replace(/_/g, " ") || "Customer";
  }
}

function roleVariant(role) {
  if (role === "b2b_buyer") return "accent";
  if (role === "b2c_customer") return "outline";
  return "secondary";
}

export default function CustomersPage() {
  const [search, setSearch] = useState("");

  const { data: customersData, isLoading } = useQuery({
    queryKey: ["admin-customers", search],
    queryFn: () => api.get("/admin/customers", { params: { search } }).then(res => res.data.data),
  });

  const customers = customersData?.data || [];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Customers"
        description="View retail and B2B customer accounts."
      />

      <Card className="py-0 shadow-sm">
        <div className="p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden py-0 shadow-sm">
        {isLoading ? (
          <AdminTableSkeleton rows={6} columns={5} className="border-0 shadow-none" />
        ) : (
        <Table>
          <TableHeader>
            <TableRow className="bg-muted">
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Customer</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest">Company</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Role</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">B2B status</TableHead>
              <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Joined</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="px-6 py-20 text-center">
                  <User className="inline-block text-muted-foreground/30 mb-2" size={48} />
                  <p className="text-sm font-medium text-muted-foreground">No customers found.</p>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((cust) => (
                <TableRow key={cust.id}>
                  <TableCell>
                    <div className="font-bold text-foreground">{cust.name}</div>
                    <div className="text-xs text-muted-foreground">{cust.email}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs text-muted-foreground">{cust.company_name || "—"}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={roleVariant(cust.role)} className="text-[10px] uppercase tracking-wider">
                      {formatRole(cust.role)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {cust.role === "b2b_buyer" ? (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-wider capitalize">
                        {cust.b2b_status || "pending"}
                      </Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-xs text-muted-foreground font-medium">
                    {new Date(cust.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}
      </Card>
    </div>
  );
}
