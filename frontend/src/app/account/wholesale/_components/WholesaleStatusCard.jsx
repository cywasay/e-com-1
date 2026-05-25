"use client";

import { Truck, CheckCircle, Clock, AlertCircle, Phone } from "lucide-react";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function WholesaleStatusCard({ user }) {
  const b2bStatus = user?.b2b_status || "none";

  return (
    <Card className="overflow-hidden py-0">
      <CardHeader className="flex flex-col gap-6 border-b md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-5">
          <StatusIcon status={b2bStatus} />
          <div>
            <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
              Partnership Level
            </p>
            <h3 className="text-xl font-bold text-foreground">{getStatusLabel(b2bStatus)}</h3>
          </div>
        </div>
        {b2bStatus === "approved" && (
          <Badge className="gap-2 bg-[#2d7a4f] px-4 py-2 text-[10px] uppercase tracking-widest text-white hover:bg-[#2d7a4f]">
            <CheckCircle size={14} /> Approved
          </Badge>
        )}
      </CardHeader>

      <CardContent className="p-8 md:p-10">
        <StatusContent status={b2bStatus} user={user} />
      </CardContent>
    </Card>
  );
}

function StatusIcon({ status }) {
  const styles = {
    approved: "bg-[#2d7a4f]/10 text-[#2d7a4f]",
    pending: "bg-amber-50 text-amber-600",
    rejected: "bg-red-50 text-red-600",
    none: "bg-muted text-muted-foreground",
  };
  return (
    <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${styles[status] || styles.none}`}>
      <Truck size={32} />
    </div>
  );
}

function getStatusLabel(s) {
  if (s === "approved") return "Active Wholesale Partner";
  if (s === "pending") return "Application Pending";
  if (s === "rejected") return "Application Declined";
  return "No Active Partnership";
}

function StatusContent({ status, user }) {
  if (status === "none") {
    return (
      <div className="space-y-6">
        <p className="text-[15px] leading-relaxed text-muted-foreground">
          You currently do not have a wholesale account. Approved B2B partners receive access to tiered pricing and bulk tools.
        </p>
        <Link href="/wholesale" className={cn(buttonVariants({ variant: "default", size: "cta" }), "rounded-full px-10")}>
          Apply for Partnership
        </Link>
      </div>
    );
  }
  if (status === "pending") {
    return (
      <Alert className="border-amber-100 bg-amber-50">
        <Clock className="text-amber-600" />
        <AlertTitle className="text-amber-900">Under Review</AlertTitle>
        <AlertDescription className="text-amber-700">
          Processing your application. Typically takes 1-2 business days.
        </AlertDescription>
      </Alert>
    );
  }
  if (status === "approved") {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Company</p>
            <p className="text-[15px] font-bold text-foreground">{user?.company_name || "Individual"}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Benefits</p>
            <p className="text-[15px] font-bold text-[#2d7a4f]">Wholesale Pricing Active</p>
          </div>
        </div>
        <div className="border-t border-border pt-6 text-[13px] text-muted-foreground italic">
          * Discounts are automatically applied when logged in.
        </div>
      </div>
    );
  }
  if (status === "rejected") {
    return (
      <div className="space-y-6">
        <Alert variant="destructive" className="border-red-100 bg-red-50">
          <AlertCircle />
          <AlertTitle>Update</AlertTitle>
          <AlertDescription>Application could not be approved at this time.</AlertDescription>
        </Alert>
        <Link
          href="/contact"
          className={cn(
            buttonVariants({ variant: "link" }),
            "inline-flex gap-2 p-0 text-[11px] font-black uppercase tracking-widest"
          )}
        >
          <Phone size={14} /> Contact Team
        </Link>
      </div>
    );
  }
  return null;
}
