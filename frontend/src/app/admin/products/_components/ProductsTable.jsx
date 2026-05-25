"use client";
import { Pencil, Trash2, Package, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardFooter } from "@/components/ui/card";
import AdminTableSkeleton from "../../_components/skeletons/AdminTableSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ProductsTable({ products, isLoading, onEdit, onDelete, page, setPage, lastPage }) {
  if (isLoading) return <AdminTableSkeleton rows={6} columns={5} />;
  if (products.length === 0) return <EmptyState />;

  return (
    <Card className="overflow-hidden py-0 shadow-sm">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted">
            <TableHead className="text-[10px] font-bold uppercase tracking-widest w-1/3">Product</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Category</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest">Price</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-center">Status</TableHead>
            <TableHead className="text-[10px] font-bold uppercase tracking-widest text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <ProductRow key={product.id} product={product} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </TableBody>
      </Table>
      <Pagination page={page} setPage={setPage} lastPage={lastPage} />
    </Card>
  );
}

function ProductRow({ product, onEdit, onDelete }) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-bold text-foreground group-hover:text-accent transition-colors">{product.name}</span>
          <div className="flex flex-wrap gap-1.5">
            {product.is_featured && <Badge variant="accent">Featured</Badge>}
            {product.is_bestseller && <Badge variant="secondary">Bestseller</Badge>}
            {product.is_eco_friendly && <Badge variant="outline">Eco Friendly</Badge>}
            {product.is_new_arrival && <Badge variant="default">New</Badge>}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="text-xs font-medium">
          {product.category?.name || "Uncategorized"}
        </Badge>
      </TableCell>
      <TableCell>
        <span className="text-sm font-bold text-foreground">AED {product.price || "0.00"}</span>
      </TableCell>
      <TableCell className="text-center">
        <StatusBadge status={product.status} />
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(product)}>
            <Pencil size={14} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(product.id)} className="hover:text-red-600">
            <Trash2 size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

function StatusBadge({ status }) {
  const variant = status === "published" ? "default" : status === "archived" ? "outline" : "secondary";
  return (
    <Badge variant={variant} className="text-[10px] uppercase tracking-wider">
      {status}
    </Badge>
  );
}

function Pagination({ page, setPage, lastPage }) {
  if (lastPage <= 1) return null;
  return (
    <CardFooter className="px-6 py-4 border-t border-border bg-muted flex items-center justify-between">
      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Page {page} of {lastPage}</span>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon-sm" disabled={page === 1} onClick={() => setPage(page - 1)}>
          <ChevronLeft size={16} />
        </Button>
        <Button variant="outline" size="icon-sm" disabled={page === lastPage} onClick={() => setPage(page + 1)}>
          <ChevronRight size={16} />
        </Button>
      </div>
    </CardFooter>
  );
}

function EmptyState() {
  return (
    <Card className="px-6 py-20 text-center shadow-sm">
      <Package className="inline-block text-muted-foreground/30 mb-2" size={48} />
      <p className="text-sm font-medium text-muted-foreground">No products found matches your criteria.</p>
    </Card>
  );
}
