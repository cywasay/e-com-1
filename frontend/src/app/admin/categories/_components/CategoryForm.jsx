"use client";
import { Plus, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoryForm({ formData, setFormData, isEditing, onClear, onSubmit, isSaving, parentOptions }) {
  return (
    <div className="sticky top-24 space-y-4">
      <Card className="overflow-hidden py-0 shadow-sm">
        <CardHeader className="px-6 py-4 border-b flex-row items-center justify-between bg-muted/50">
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest">{isEditing ? "Edit Category" : "Create New Category"}</h3>
          {isEditing && (
            <Button variant="link" onClick={onClear} className="text-[10px] font-bold uppercase tracking-wider h-auto p-0">
              <Plus size={12} /> New
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-6">
          <form onSubmit={onSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Category Name</Label>
              <Input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} placeholder="e.g., Corporate Wear" />
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Parent Category</Label>
              <Select
                value={formData.parent_id ? String(formData.parent_id) : "none"}
                onValueChange={(v) => setFormData({ ...formData, parent_id: v === "none" ? "" : v })}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None (Top Level)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (Top Level)</SelectItem>
                  {parentOptions.map((opt) => (
                    <SelectItem key={opt.id} value={String(opt.id)}>
                      {"\u00A0".repeat(opt.depth * 2)} {opt.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sort Order</Label>
                <Input type="number" value={formData.sort_order} onChange={(e) => setFormData({ ...formData, sort_order: parseInt(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Status</Label>
                <StatusToggle active={formData.is_active} onToggle={() => setFormData({ ...formData, is_active: !formData.is_active })} />
              </div>
            </div>
            <div className="pt-6 border-t border-border flex items-center gap-3">
              <Button type="submit" disabled={isSaving} className="flex-1 text-xs font-bold uppercase tracking-widest">
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? <Check size={14} /> : <Plus size={14} />}
                {isEditing ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="ghost" onClick={onClear} className="text-xs font-bold uppercase tracking-widest">
                Clear
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <ProTip />
    </div>
  );
}

function StatusToggle({ active, onToggle }) {
  return (
    <div className="flex items-center gap-2 h-[42px]">
      <Switch checked={active} onCheckedChange={onToggle} />
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{active ? "Active" : "Inactive"}</span>
    </div>
  );
}

function ProTip() {
  return (
    <Alert className="border-accent/20 bg-accent/10">
      <AlertDescription className="text-[10px] text-accent leading-relaxed">
        <span className="font-bold text-accent uppercase tracking-widest block mb-2">Pro Tip</span>
        Use parent categories to create groups like &quot;Corporate Wear&quot; and sub-categories like &quot;Shirts&quot; for better navigation.
      </AlertDescription>
    </Alert>
  );
}
