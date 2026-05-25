"use client";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function QuoteManagementPanel({ quote, onUpdate, isUpdating }) {
  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-4">Management</h4>
        <Card className="shadow-sm">
          <CardContent className="p-8 space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Update Status</Label>
              <Select
                value={quote.status}
                onValueChange={(value) => onUpdate(quote.id, value, quote.admin_notes)}
              >
                <SelectTrigger className="w-full text-xs font-bold uppercase tracking-widest">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="quoted">Quoted</SelectItem>
                  <SelectItem value="closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Admin Notes</Label>
              <Textarea
                defaultValue={quote.admin_notes}
                onBlur={(e) => onUpdate(quote.id, quote.status, e.target.value)}
                className="h-24 text-xs"
                placeholder="Add internal notes..."
              />
            </div>
            <div className="pt-2">
              {isUpdating && (
                <div className="flex items-center gap-2 text-accent text-[10px] font-black uppercase tracking-widest">
                  <Loader2 size={12} className="animate-spin" /> Saving...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
