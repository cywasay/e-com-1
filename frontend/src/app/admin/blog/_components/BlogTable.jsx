"use client";
import { Search, FileText, Tag as TagIcon, CheckCircle2, Clock, Edit2, Trash2 } from "lucide-react";
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

export default function BlogTable({ posts, isLoading, searchQuery, setSearchQuery, onEdit, onDelete }) {
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
            placeholder="Filter by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardContent>
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="uppercase tracking-widest text-[10px]">Title</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Category</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Status</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px]">Date</TableHead>
            <TableHead className="uppercase tracking-widest text-[10px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                No blog posts found.
              </TableCell>
            </TableRow>
          ) : (
            posts.map((post) => (
              <PostRow key={post.id} post={post} onEdit={onEdit} onDelete={onDelete} />
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );
}

function PostRow({ post, onEdit, onDelete }) {
  return (
    <TableRow className="group">
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center text-muted-foreground">
            {post.featured_image ? (
              <img src={post.featured_image} alt="" className="w-full h-full object-cover" />
            ) : (
              <FileText size={20} />
            )}
          </div>
          <div>
            <p className="font-bold text-foreground leading-tight">{post.title}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{post.author?.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant="secondary" className="gap-1 uppercase tracking-wider text-[10px]">
          <TagIcon size={10} /> {post.category_tag || "Uncategorized"}
        </Badge>
      </TableCell>
      <TableCell>
        {post.status === "published" ? (
          <Badge variant="default" className="gap-1">
            <CheckCircle2 size={12} /> Published
          </Badge>
        ) : (
          <Badge variant="outline" className="gap-1">
            <Clock size={12} /> Draft
          </Badge>
        )}
      </TableCell>
      <TableCell className="text-xs text-muted-foreground font-medium">
        {format(new Date(post.created_at), "MMM d, yyyy")}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon-sm" onClick={() => onEdit(post)}>
            <Edit2 size={16} />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={() => onDelete(post.id)} className="hover:text-red-600">
            <Trash2 size={16} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
