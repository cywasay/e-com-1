"use client";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function OrdersFilters({ search, setSearch, status, setStatus, buyerType, setBuyerType }) {
  return (
    <Card className="py-0 shadow-sm">
      <CardContent className="p-4 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <Input
            type="text"
            placeholder="Search by Order ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 bg-gray-50 border-none text-xs"
          />
        </div>
        <Select value={status || "all"} onValueChange={(v) => setStatus(v === "all" ? "" : v)}>
          <SelectTrigger className="min-w-[140px] bg-gray-50 border-none text-xs">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={buyerType || "all"} onValueChange={(v) => setBuyerType(v === "all" ? "" : v)}>
          <SelectTrigger className="min-w-[140px] bg-gray-50 border-none text-xs">
            <SelectValue placeholder="All Buyer Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Buyer Types</SelectItem>
            <SelectItem value="b2c">Retail (B2C)</SelectItem>
            <SelectItem value="b2b">Wholesale (B2B)</SelectItem>
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
}
