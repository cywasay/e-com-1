"use client";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function CaseStudyModal({ isOpen, onClose, editingCase, onSubmit, isSaving }) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] flex flex-col overflow-hidden p-0">
        <DialogHeader className="p-6 border-b border-border bg-muted/50">
          <DialogTitle>{editingCase ? "Edit Case Study" : "New Case Study"}</DialogTitle>
          <DialogDescription>Portfolio & Excellence</DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6">
          <FormFields editingCase={editingCase} />
          <DialogFooter className="sticky bottom-0 bg-white border-t border-border pt-6">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCase ? "Update" : "Save Case Study"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FormFields({ editingCase }) {
  const [status, setStatus] = useState(editingCase?.status || "draft");

  useEffect(() => {
    setStatus(editingCase?.status || "draft");
  }, [editingCase]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2 md:col-span-2">
        <Label className="uppercase tracking-wider text-xs">Project Title</Label>
        <Input name="title" defaultValue={editingCase?.title} required />
      </div>
      <div className="space-y-2">
        <Label className="uppercase tracking-wider text-xs">Client Name</Label>
        <Input name="client_name" defaultValue={editingCase?.client_name} />
      </div>
      <div className="space-y-2">
        <Label className="uppercase tracking-wider text-xs">Industry</Label>
        <Input name="industry" defaultValue={editingCase?.industry} />
      </div>
      <div className="space-y-2">
        <Label className="uppercase tracking-wider text-xs">Status</Label>
        <input type="hidden" name="status" value={status} />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="uppercase tracking-wider text-xs">Featured Image URL</Label>
        <Input name="featured_image" defaultValue={editingCase?.featured_image} />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="uppercase tracking-wider text-xs">Excerpt</Label>
        <Textarea name="excerpt" defaultValue={editingCase?.excerpt} rows={2} className="resize-none" />
      </div>
      <div className="space-y-2 md:col-span-2">
        <Label className="uppercase tracking-wider text-xs">Content</Label>
        <Textarea name="content" defaultValue={editingCase?.content} required rows={10} className="font-mono" />
      </div>
    </div>
  );
}
