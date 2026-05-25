"use client";
import { Tag, Calendar, Info, Users, Percent, Trash2 } from "lucide-react";
import AdminPanelSkeleton from "../../_components/skeletons/AdminPanelSkeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function PriceSetDetail({ setDetail, isLoading, onAssign, onAddItem, onRemoveItem }) {
  if (!setDetail && !isLoading) return <EmptyState />;
  if (isLoading) {
    return <AdminPanelSkeleton sections={2} />;
  }

  return (
    <div className="space-y-8">
      <SetHeader detail={setDetail} />
      <SetAssignments assignments={setDetail.assignments} type={setDetail.type} onAssign={onAssign} />
      <SetOverrides items={setDetail.items} onAddItem={onAddItem} onRemoveItem={onRemoveItem} />
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="p-20 text-center border-dashed shadow-sm">
      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm text-gray-300 mb-4">
        <Tag size={32} />
      </div>
      <p className="text-sm font-bold text-foreground">No Price Set Selected</p>
      <p className="text-xs text-gray-400">Select a price set to manage overrides.</p>
    </Card>
  );
}

function SetHeader({ detail }) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-black text-foreground uppercase tracking-tight">{detail.name}</h2>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{detail.type.replace("_", " ")}</p>
          </div>
          <Badge variant={detail.is_active ? "default" : "outline"} className="uppercase tracking-widest text-[10px]">
            {detail.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <InfoItem icon={<Calendar size={10} />} label="Starts" value={detail.starts_at ? new Date(detail.starts_at).toLocaleDateString() : "Immediate"} />
          <InfoItem icon={<Calendar size={10} />} label="Ends" value={detail.ends_at ? new Date(detail.ends_at).toLocaleDateString() : "Never"} />
          <InfoItem icon={<Info size={10} />} label="Type" value={detail.type} valueClass="text-accent" />
        </div>
      </CardContent>
    </Card>
  );
}

function InfoItem({ icon, label, value, valueClass = "" }) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1">{icon} {label}</p>
      <p className={`text-xs font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function SetAssignments({ assignments, type, onAssign }) {
  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-100 bg-gray-50/50">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Users size={12} /> Target Audience
        </h5>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        {assignments?.map((asgn) => (
          <div key={asgn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-sm border border-gray-100">
            <div>
              <p className="text-xs font-bold text-foreground">{asgn.scope === "all_b2b" ? "All Wholesale" : asgn.user?.name}</p>
              <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">{asgn.scope}</p>
            </div>
          </div>
        ))}
        {assignments?.length === 0 && (
          <div className="py-4 text-center">
            <Button
              variant="link"
              onClick={() => {
                const scope = type === "global_sale" ? "all_b2b" : "buyer_specific";
                const userId = scope === "buyer_specific" ? prompt("User ID:") : null;
                onAssign({ scope, user_id: userId });
              }}
              className="text-[10px] font-black uppercase tracking-widest h-auto p-0"
            >
              + Add Target
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function SetOverrides({ items, onAddItem, onRemoveItem }) {
  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardHeader className="p-4 border-b border-gray-100 bg-gray-50/50 flex-row items-center justify-between">
        <h5 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
          <Percent size={12} /> Overrides
        </h5>
        <Button
          variant="link"
          onClick={() => {
            const pid = prompt("Product ID:");
            const p = prompt("Price:");
            if (pid && p) onAddItem({ product_id: pid, override_price: p });
          }}
          className="text-[9px] font-black uppercase tracking-widest h-auto p-0"
        >
          + Add Product
        </Button>
      </CardHeader>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-bold uppercase tracking-widest text-xs">Product</TableHead>
            <TableHead className="font-bold uppercase tracking-widest text-xs">Base</TableHead>
            <TableHead className="font-bold uppercase tracking-widest text-xs text-accent">Override</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-bold text-foreground">{item.product.name}</TableCell>
              <TableCell className="text-gray-400">AED {item.product.base_retail_price}</TableCell>
              <TableCell className="font-black text-accent">AED {item.override_price}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon-sm" onClick={() => onRemoveItem(item.id)} className="text-red-400 hover:text-red-600">
                  <Trash2 size={14} />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
