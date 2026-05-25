"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowLeft, Building2, Share2, Briefcase, CheckCircle2, Tag } from "lucide-react";
import StorefrontLayout from "@/components/StorefrontLayout";
import { renderContentHtml } from "@/lib/renderContent";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const DEFAULT_SCOPE = ["Strategic Design", "Material Science", "Scale Logistics", "Brand Consistency"];

export default function CaseStudyDetailClient({ slug, initialItem }) {
  const { data: item, isLoading, error } = useQuery({
    queryKey: ["case-study", slug],
    queryFn: async () => {
      const response = await api.get(`/case-studies/${slug}`);
      return response.data;
    },
    initialData: initialItem || undefined,
  });

  if (isLoading && !item) {
    return (
      <StorefrontLayout>
        <div className="mx-auto max-w-5xl px-6 py-16 space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="aspect-[21/9] w-full rounded-lg" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="lg:col-span-4 h-48 rounded-lg" />
          </div>
        </div>
      </StorefrontLayout>
    );
  }

  if (error || !item) {
    return (
      <StorefrontLayout>
        <div className="flex flex-col items-center justify-center p-6 text-center py-24">
          <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">Content Not Found</h1>
          <p className="text-[#6b6560] mb-8 max-w-md">The success story you are looking for is currently unavailable.</p>
          <Link href="/case-studies" className={cn(buttonVariants({ variant: "accent", size: "cta" }), "inline-flex gap-2")}>
            <ArrowLeft size={18} />
            Back to Portfolio
          </Link>
        </div>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <Link
          href="/case-studies"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mb-12 inline-flex h-auto gap-2 p-0 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:bg-transparent hover:text-foreground"
          )}
        >
          <ArrowLeft size={14} />
          Back to Case Studies
        </Link>

        <header className="space-y-6 mb-12">
          <div className="flex items-center gap-4">
            {item.industry && (
              <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                {item.industry}
              </Badge>
            )}
            <span className="text-[#6b6560] text-[10px] font-bold uppercase tracking-widest">Success Story</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] tracking-tight leading-tight">
            {item.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#e8e4dc]">
            <div>
              <p className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest mb-1">Client</p>
              <p className="text-[#1a1a2e] font-bold flex items-center gap-2">
                <Building2 size={16} className="text-[#c8a96e]" />
                {item.client_name || "Confidential"}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest mb-1">Impact</p>
              <p className="text-[#2d7a4f] font-bold flex items-center gap-2">
                <CheckCircle2 size={16} />
                Strategic Transformation
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest mb-1">Sector</p>
              <p className="text-[#1a1a2e] font-bold">{item.industry || "Corporate"}</p>
            </div>
          </div>
        </header>

        {item.featured_image && (
          <div className="aspect-[21/9] rounded-lg overflow-hidden mb-12 border border-[#e8e4dc]">
            <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="prose prose-slate prose-lg max-w-none 
              prose-headings:text-[#1a1a2e] prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-[#6b6560] prose-p:leading-relaxed
              prose-a:text-[#c8a96e] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1a1a2e] prose-strong:font-bold
              prose-img:rounded-lg prose-img:border prose-img:border-[#e8e4dc]
              prose-blockquote:border-l-4 prose-blockquote:border-[#c8a96e] prose-blockquote:bg-white prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-lg"
            >
              <div dangerouslySetInnerHTML={{ __html: renderContentHtml(item.content) }} />
            </div>

            <div className="mt-16 pt-8 border-t border-[#e8e4dc] flex items-center gap-4">
              <Tag size={16} className="text-[#e8e4dc]" />
              <span className="px-3 py-1 bg-white text-[#6b6560] border border-[#e8e4dc] text-[10px] font-bold uppercase tracking-widest rounded">
                {item.industry || "Case Analysis"}
              </span>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground">
                  <Briefcase size={16} className="text-accent" />
                  Service Scope
                </h3>
                <ul className="space-y-3">
                  {DEFAULT_SCOPE.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1 w-1 rounded-full bg-accent" />
                      {p}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Share Impact</span>
                <Button type="button" variant="ghost" size="icon-sm" className="text-muted-foreground hover:text-accent">
                  <Share2 size={18} />
                </Button>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </StorefrontLayout>
  );
}
