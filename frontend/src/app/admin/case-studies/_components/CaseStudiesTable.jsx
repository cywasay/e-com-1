"use client";
import { Search, Briefcase, Building2, Tag as TagIcon, CheckCircle2, Clock, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import AdminTableSkeleton from "../../_components/skeletons/AdminTableSkeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function CaseStudiesTable({ cases, isLoading, searchQuery, setSearchQuery, onEdit, onDelete }) {
  if (isLoading) {
    return <AdminTableSkeleton rows={6} columns={5} showSearch />;
  }

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardContent className="p-4 border-b border-border bg-muted/50">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <Input
            type="text"
            placeholder="Filter by title or client..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="uppercase tracking-widest text-[10px]">Title & Client</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Industry</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Status</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Date</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-12 text-center text-muted-foreground">No case studies found.</TableCell>
            </TableRow>
          ) : (
            cases.map((item) => <CaseRow key={item.id} item={item} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function CaseRow({ item, onEdit, onDelete }) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-muted-foreground border border-border overflow-hidden">
            {item.featured_image ? <img src={item.featured_image} alt="" className="w-full h-full object-cover" /> : <Briefcase size={20} />}
          </div>
          <div>
            <p className="font-bold text-foreground leading-tight">{item.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1"><Building2 size={10} /> {item.client_name || "Anonymous"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="gap-1 uppercase tracking-wider text-[10px]">
          <TagIcon size={10} /> {item.industry || "General"}
        </Badge>
      </TableCell>
      <TableCell>
        {item.status === "published" ? (
          <Badge variant="default" className="gap-1"><CheckCircle2 size={12} /> Published</Badge>
        ) : (
          <Badge variant="outline" className="gap-1"><Clock size={12} /> Draft</Badge>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground font-medium">{format(new Date(item.created_at), "MMM d, yyyy")}</TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(item)}><Edit2 size={16} /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(item.id)} className="hover:text-red-600"><Trash2 size={16} /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
