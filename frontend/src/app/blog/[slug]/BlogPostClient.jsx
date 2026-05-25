"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Share2, BookOpen } from "lucide-react";
import { format } from "date-fns";
import StorefrontLayout from "@/components/StorefrontLayout";
import { renderContentHtml } from "@/lib/renderContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function BlogPostClient({ slug, initialPost }) {
  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const response = await api.get(`/blog/${slug}`);
      return response.data;
    },
    initialData: initialPost || undefined,
  });

  if (isLoading && !post) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-4xl px-6 py-16 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="aspect-[21/9] w-full rounded-lg" />
          <div className="space-y-3">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-4 w-full" />
            ))}
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (error || !post) {
    return (
      <StorefrontLayout>
        <div className="flex flex-col items-center justify-center p-6 text-center py-24">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">Post Not Found</h1>
          <p className="text-[#6b6560] mb-8 max-w-md">The article you are looking for might have been moved or archived.</p>
          <Link href="/blog" className={cn(buttonVariants({ variant: "accent", size: "cta" }), "inline-flex gap-2")}>
            <ArrowLeft size={18} />
            Back to Blog
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link
          href="/blog"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mb-12 inline-flex h-auto gap-2 p-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-transparent hover:text-foreground"
          )}
        >
          <ArrowLeft size={14} />
          Back to Archive
        </Link>

        <header className="space-y-6 mb-12">
          {post.category_tag && (
            <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
              {post.category_tag}
            </Badge>
          )}

          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-6 text-xs font-semibold text-[#6b6560] uppercase tracking-widest border-t border-[#e8e4dc]">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#c8a96e]" />
              <span>{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#c8a96e]" />
              <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-[#c8a96e]" />
              <span>{Math.ceil((post.content || "").split(" ").length / 200)} min read</span>
            </div>
          </div>
        </header>

        {post.featured_image && (
          <div className="aspect-[21/9] rounded-lg overflow-hidden mb-12 border border-[#e8e4dc]">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:text-[#1a1a2e] prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-[#6b6560] prose-p:leading-relaxed
          prose-a:text-[#c8a96e] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#1a1a2e] prose-strong:font-bold
          prose-img:rounded-lg prose-img:border prose-img:border-[#e8e4dc]
          prose-blockquote:border-l-4 prose-blockquote:border-[#c8a96e] prose-blockquote:bg-white prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
        >
          <div dangerouslySetInnerHTML={{ __html: renderContentHtml(post.content) }} />
        </div>

        <div className="mt-16 pt-8 border-t border-[#e8e4dc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Share this story:</span>
            <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-accent">
              <Share2 size={18} />
            </Button>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
