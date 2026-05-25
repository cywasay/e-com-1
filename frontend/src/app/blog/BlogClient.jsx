"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Calendar, User, ArrowRight, BookOpen } from "lucide-react";
import { format } from "date-fns";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogClient({ initialData }) {
  const [page, setPage] = useState(1);

  const { data: postsData, isLoading, isFetching } = useQuery({
    queryKey: ["public-blog", page],
    queryFn: async () => {
      const response = await api.get("/blog", { params: { page } });
      return response.data;
    },
    initialData: page === 1 ? initialData || undefined : undefined,
    placeholderData: (previous) => previous,
  });

  const posts = postsData?.data || [];
  const lastPage = postsData?.last_page || 1;
  const currentPage = postsData?.current_page || page;

  return (
    <StorefrontLayout>
      <section className="bg-[#1a1a2e] py-24 border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Insights & Industry News
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Exploring the intersection of technology, textile engineering, and corporate identity.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {isLoading && !posts.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden py-0">
                <Skeleton className="aspect-[16/10] w-full" />
                <CardContent className="space-y-3 p-6">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6b6560]">No stories found in the archive yet.</p>
          </div>
        ) : (
          <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 transition-opacity ${isFetching ? "opacity-70" : ""}`}>
            {posts.map((post) => (
              <Card key={post.id} className="group gap-0 overflow-hidden py-0 transition-colors hover:border-accent">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    {post.featured_image ? (
                      <img
                        src={post.featured_image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#e8e4dc]">
                        <BookOpen size={48} />
                      </div>
                    )}
                    {post.category_tag && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="bg-white text-[10px] uppercase tracking-wider shadow-sm">
                          {post.category_tag}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="space-y-4 p-6">
                    <div className="flex items-center gap-4 text-xs font-medium text-[#6b6560] uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.created_at ? format(new Date(post.created_at), "MMM d, yyyy") : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {post.author?.name}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-[#1a1a2e] group-hover:text-[#c8a96e] transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h2>

                    <p className="text-[#6b6560] line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt || (post.content && post.content.substring(0, 160).replace(/[#*`]/g, "") + "...")}
                    </p>

                    <div className="pt-2 flex items-center gap-2 text-[#c8a96e] font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      Read Article
                      <ArrowRight size={14} />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}

        {lastPage > 1 && (
          <div className="mt-16 pt-10 border-t border-[#e8e4dc] flex justify-center gap-2">
            {[...Array(lastPage)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  type="button"
                  variant={currentPage === pageNum ? "accent" : "outline"}
                  size="icon-sm"
                  className="h-10 w-10 text-xs font-bold"
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
