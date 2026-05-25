"use client";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PricePreviewTool({ products, customers, previewProductId, setPreviewProductId, previewUserId, setPreviewUserId, onPreview, isPending, previewData }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <div className="flex items-center gap-2 mb-1">
          <Eye size={16} />
          <h3 className="text-base font-medium">Price resolution preview</h3>
        </div>
        <p className="text-sm text-muted-foreground">Test how the pricing engine resolves final prices.</p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Select product</Label>
            <Select value={previewProductId || "none"} onValueChange={(v) => setPreviewProductId(v === "none" ? "" : v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Select a product...</SelectItem>
                {products?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1">
            <Label className="text-xs">Select customer</Label>
            <Select value={previewUserId || "guest"} onValueChange={(v) => setPreviewUserId(v === "guest" ? "" : v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Guest (retail)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="guest">Guest (retail)</SelectItem>
                {customers?.filter((c) => c.role === "b2b_buyer" || c.role === "b2b").map((c) => (
                  <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={onPreview}
            disabled={!previewProductId || isPending}
            variant="accent"
            className="min-w-[140px] h-[38px]"
          >
            {isPending ? <Loader2 size={14} className="animate-spin" /> : "Preview price"}
          </Button>
        </div>
        {previewData && <PreviewResult data={previewData} />}
      </CardContent>
    </Card>
  );
}

function PreviewResult({ data }) {
  return (
    <Card className="mt-6 shadow-sm animate-in fade-in slide-in-from-bottom-2">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Resolved price</p>
            <p className="text-[28px] font-bold text-[#1F2937]">AED {data.resolved_price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-2">Rule applied</p>
            <Badge variant="secondary">{data.rule_applied.replace("_", " ")}</Badge>
          </div>
          <div>
            <p className="text-[11px] text-gray-500 mb-1">Source</p>
            <p className="text-sm font-medium text-[#1F2937] truncate">{data.price_set_name || "N/A"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
