"use client";
import React, { Fragment } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import QuoteDetailRow from "./QuoteDetailRow";
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

export default function QuotesTable({ quotes, isLoading, expandedId, setExpandedId, ...props }) {
  if (isLoading) return <AdminTableSkeleton rows={6} columns={5} />;
  if (!quotes?.length) return <EmptyState />;

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-black uppercase text-[9px] tracking-widest">Customer</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-widest">Company / Interest</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-widest">Status</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-widest">Date</TableHead>
            <TableHead className="font-black uppercase text-[9px] tracking-widest text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {quotes.map((quote) => (
            <Fragment key={quote.id}>
              <TableRow
                onClick={() => setExpandedId(expandedId === quote.id ? null : quote.id)}
                className={`cursor-pointer ${expandedId === quote.id ? "bg-muted/80" : ""}`}
              >
                <TableCell>
                  <div className="font-black text-foreground">{quote.name}</div>
                  <div className="text-[10px] text-muted-foreground font-medium lowercase">{quote.email}</div>
                </TableCell>
                <TableCell>
                  <div className="font-bold text-foreground text-xs">{quote.company_name || "—"}</div>
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-tight truncate max-w-[200px]">{quote.product_interest || "N/A"}</div>
                </TableCell>
                <TableCell><StatusBadge status={quote.status} /></TableCell>
                <TableCell className="text-muted-foreground font-bold text-[10px]">{new Date(quote.created_at).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  {expandedId === quote.id ? <ChevronUp size={16} className="ml-auto" /> : <ChevronDown size={16} className="ml-auto" />}
                </TableCell>
              </TableRow>
              {expandedId === quote.id && <QuoteDetailRow quote={quote} {...props} />}
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}

function StatusBadge({ status }) {
  const variantMap = {
    new: "secondary",
    in_progress: "outline",
    quoted: "default",
    closed: "outline",
  };
  return (
    <Badge variant={variantMap[status] || "outline"} className="text-[8px] font-black uppercase tracking-widest">
      {status.replace("_", " ")}
    </Badge>
  );
}

function EmptyState() {
  return (
    <Card className="py-20 text-center opacity-40 shadow-sm">
      <Package size={48} className="mx-auto mb-4" />
      <p className="font-black uppercase tracking-widest text-xs">No quote requests found</p>
    </Card>
  );
}
