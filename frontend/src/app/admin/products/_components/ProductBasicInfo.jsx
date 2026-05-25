"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductBasicInfo({ formData, setFormData, categoryOptions }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Product Name</Label>
        <Input
          required
          type="text"
          value={formData.name ?? ""}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Premium Cotton Lab Coat"
        />
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category</Label>
        <Select
          value={formData.category_id ? String(formData.category_id) : "none"}
          onValueChange={(v) => setFormData({ ...formData, category_id: v === "none" ? "" : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Uncategorized" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Uncategorized</SelectItem>
            {categoryOptions.map((opt) => (
              <SelectItem key={opt.id} value={String(opt.id)}>{opt.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</Label>
        <Select value={formData.status ?? "draft"} onValueChange={(v) => setFormData({ ...formData, status: v })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-2">
        <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Visibility</Label>
        <Select value={formData.visibility ?? "both"} onValueChange={(v) => setFormData({ ...formData, visibility: v })}>
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="both">Both (B2B & B2C)</SelectItem>
            <SelectItem value="b2c_only">B2C Only</SelectItem>
            <SelectItem value="b2b_only">B2B Only</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
