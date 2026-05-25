"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CreatePriceSetModal({ isOpen, onClose, onCreate, isPending }) {
  const [type, setType] = useState("global_sale");

  useEffect(() => {
    if (isOpen) setType("global_sale");
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="uppercase tracking-tight">New Price Set</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.target);
            onCreate({ name: fd.get("name"), type, is_active: true });
          }}
          className="space-y-6"
        >
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Price Set Name</Label>
            <Input name="name" required placeholder="E.g. Summer 2026 Sale" className="font-bold" />
          </div>
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Type</Label>
            <input type="hidden" name="type" value={type} />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="w-full font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="global_sale">Global Sale (All B2B)</SelectItem>
                <SelectItem value="buyer_specific">Buyer Specific Override</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-4 sm:gap-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 uppercase tracking-widest text-[10px]">
              Cancel
            </Button>
            <Button type="submit" disabled={isPending} className="flex-1 uppercase tracking-widest text-[10px]">
              {isPending ? <Loader2 size={12} className="animate-spin" /> : "Create Set"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
