"use client";
import { Fragment } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import ApplicationDetailRow from "./ApplicationDetailRow";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AdminTableSkeleton from "../../_components/skeletons/AdminTableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ApplicationsTable({ apps, isLoading, expandedId, setExpandedId, ...props }) {
  if (isLoading) return <AdminTableSkeleton rows={6} columns={5} />;
  if (!apps?.length) {
    return (
      <Card className="py-20 text-center text-gray-400 italic text-sm shadow-sm">
        No applications found for this filter.
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Applicant</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Company</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Volume</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apps.map((app) => (
            <Fragment key={app.id}>
              <TableRow
                onClick={() => setExpandedId(expandedId === app.id ? null : app.id)}
                className={`cursor-pointer ${expandedId === app.id ? "bg-accent/5" : ""}`}
              >
                <TableCell>
                  <div className="font-bold text-foreground">{app.user.name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{app.user.email}</div>
                </TableCell>
                <TableCell>
                  <div className="font-medium text-gray-700">{app.company_name}</div>
                  <div className="text-[10px] text-gray-400 font-medium">{app.business_type}</div>
                </TableCell>
                <TableCell className="font-medium">{app.est_order_volume}</TableCell>
                <TableCell className="text-center"><StatusBadge status={app.status} /></TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-3">
                    <div className="text-[10px] text-gray-400 font-medium">{new Date(app.created_at).toLocaleDateString()}</div>
                    {expandedId === app.id ? <ChevronUp size={14} className="text-accent" /> : <ChevronDown size={14} className="text-gray-300" />}
                  </div>
                </TableCell>
              </TableRow>
              {expandedId === app.id && <ApplicationDetailRow app={app} {...props} />}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function StatusBadge({ status }) {
  const variantMap = {
    approved: "default",
    rejected: "destructive",
    pending: "outline",
  };
  return (
    <Badge variant={variantMap[status] || "outline"} className="text-[9px] font-black uppercase tracking-widest">
      {status}
    </Badge>
  );
}
