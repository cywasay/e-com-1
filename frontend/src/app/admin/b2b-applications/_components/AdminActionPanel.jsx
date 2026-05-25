"use client";
import { Check, Loader2, X } from "lucide-react";
import toast from "react-hot-toast";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminActionPanel({ appId, onApprove, onReject, isApproving, isRejecting, adminNotes, setAdminNotes }) {
  return (
    <div className="space-y-6">
      <h4 className="text-[11px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2">
        <Check size={12} /> Admin Action
      </h4>
      <Card className="shadow-sm">
        <CardContent className="p-4 space-y-4">
          <Textarea
            placeholder="Admin notes (required for rejection)..."
            value={adminNotes}
            onChange={(e) => setAdminNotes(e.target.value)}
            className="h-24 text-xs"
          />
          <div className="flex gap-3">
            <Button
              onClick={() => onApprove(appId)}
              disabled={isApproving}
              variant="accent"
              className="flex-1 text-[10px] font-black uppercase tracking-widest h-auto py-2"
            >
              {isApproving ? <Loader2 size={12} className="animate-spin" /> : <><Check size={14} /> Approve</>}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                if (!adminNotes) {
                  toast.error("Admin notes are required for rejection");
                  return;
                }
                onReject({ id: appId, notes: adminNotes });
              }}
              disabled={isRejecting}
              className="flex-1 text-[10px] font-black uppercase tracking-widest h-auto py-2"
            >
              {isRejecting ? <Loader2 size={12} className="animate-spin" /> : <><X size={14} /> Reject</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
