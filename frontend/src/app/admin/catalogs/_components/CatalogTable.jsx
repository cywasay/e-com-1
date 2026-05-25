"use client";
import { Search, Image as ImageIcon, FileText, Edit2, Trash2 } from "lucide-react";
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

export default function CatalogTable({ catalogs, isLoading, searchTerm, setSearchTerm, onEdit, onDelete }) {
  if (isLoading) {
    return <AdminTableSkeleton rows={5} columns={5} showSearch />;
  }

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <CardContent className="p-4 border-b border-gray-200">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <Input
            type="text"
            placeholder="Search catalogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>Cover</TableHead>
            <TableHead>Name & Description</TableHead>
            <TableHead>File</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {catalogs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="p-8 text-center text-gray-500">No catalogs found.</TableCell>
            </TableRow>
          ) : (
            catalogs.map((catalog) => <CatalogRow key={catalog.id} catalog={catalog} onEdit={onEdit} onDelete={onDelete} />)
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function CatalogRow({ catalog, onEdit, onDelete }) {
  return (
    <TableRow>
      <TableCell>
        {catalog.cover_image ? (
          <img src={catalog.cover_image} alt="" className="w-12 h-16 object-cover rounded border border-gray-200" />
        ) : (
          <div className="w-12 h-16 bg-gray-100 rounded border border-gray-200 flex items-center justify-center text-gray-400">
            <ImageIcon size={20} />
          </div>
        )}
      </TableCell>
      <TableCell>
        <p className="font-medium text-foreground">{catalog.name}</p>
        <p className="text-sm text-gray-500 line-clamp-1">{catalog.description}</p>
      </TableCell>
      <TableCell>
        <a href={catalog.file_url} target="_blank" rel="noopener noreferrer" className="text-sm text-accent hover:underline flex items-center gap-1">
          <FileText size={14} /> View PDF
        </a>
      </TableCell>
      <TableCell>
        <Badge variant={catalog.is_active ? "default" : "outline"}>
          {catalog.is_active ? "Active" : "Draft"}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-2">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(catalog)}><Edit2 size={16} /></Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(catalog.id)} className="hover:text-red-600"><Trash2 size={16} /></Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
