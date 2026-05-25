"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { ArrowRight, Briefcase, Building2 } from "lucide-react";
import StorefrontLayout from "@/components/StorefrontLayout";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CaseStudiesClient({ initialCaseStudies }) {
  const { data: casesData, isLoading } = useQuery({
    queryKey: ["public-case-studies"],
    queryFn: async () => {
      const response = await api.get("/case-studies");
      return response.data;
    },
    initialData: initialCaseStudies ? { data: initialCaseStudies } : undefined
  });

  const caseStudies = casesData?.data || initialCaseStudies || [];

  return (
    <StorefrontLayout>

      {/* Hero Section */}
      <section className="bg-[#1a1a2e] py-24 border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Proven Results & Success Stories
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Discover how uniforms.ae transforms corporate identities through innovative textile engineering and strategic uniform programs.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-20">
        {isLoading && !initialCaseStudies ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="overflow-hidden py-0">
                <Skeleton className="aspect-[16/9] w-full" />
                <CardContent className="space-y-3 p-8">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-7 w-full" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : caseStudies.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg border border-dashed border-[#e8e4dc]">
            <Briefcase size={48} className="mx-auto text-[#e8e4dc] mb-4" />
            <p className="text-[#6b6560] font-bold uppercase tracking-widest text-[10px]">The archive is currently being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {caseStudies.map((item) => (
              <Card key={item.id} className="group gap-0 overflow-hidden py-0 transition-colors hover:border-accent">
                <Link href={`/case-studies/${item.slug}`} className="flex h-full flex-col">
                  <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                    {item.featured_image ? (
                      <img 
                        src={item.featured_image} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#e8e4dc]">
                        <Briefcase size={64} />
                      </div>
                    )}
                    {item.industry && (
                      <div className="absolute top-4 left-4">
                        <Badge variant="outline" className="bg-white text-[10px] uppercase tracking-widest shadow-sm">
                          {item.industry}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <CardContent className="flex flex-1 flex-col space-y-4 p-8">
                    <div className="flex items-center gap-2 text-[#c8a96e] text-[10px] font-bold uppercase tracking-widest">
                      <Building2 size={12} />
                      {item.client_name || 'Strategic Partnership'}
                    </div>
                    
                    <h2 className="text-2xl font-bold text-[#1a1a2e] group-hover:text-[#c8a96e] transition-colors leading-tight">
                      {item.title}
                    </h2>
                    
                    <p className="text-[#6b6560] text-sm leading-relaxed flex-1 line-clamp-3">
                      {item.excerpt || (item.content && item.content.substring(0, 180) + '...')}
                    </p>
                    
                    <div className="pt-4 border-t border-[#e8e4dc] flex items-center gap-2 text-[#1a1a2e] font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      Explore Case Study
                      <ArrowRight size={16} className="text-[#c8a96e]" />
                    </div>
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>

    </StorefrontLayout>
  );
}
