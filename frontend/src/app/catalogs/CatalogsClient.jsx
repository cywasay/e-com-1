"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import StorefrontLayout from "@/components/StorefrontLayout";
import { FileText, Download } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export default function CatalogsClient({ initialCatalogs }) {
  const { data, isLoading } = useQuery({
    queryKey: ["catalogs", "public"],
    queryFn: async () => {
      const res = await api.get("/catalogs");
      return res.data.data;
    },
    initialData: initialCatalogs,
  });

  const catalogs = data || [];

  return (
    <StorefrontLayout>
      <div className="border-b border-[#ffffff]/10 bg-[#1a1a2e] py-16 text-white md:py-24">
        <div className="mx-auto max-w-7xl px-6 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight md:text-5xl">
            Product <span className="text-accent">Catalogs</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/80">
            Download our latest product catalogs and collections.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        {isLoading && !initialCatalogs?.length ? (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden py-0">
                <Skeleton className="aspect-[3/4] w-full" />
                <CardContent className="space-y-3 p-6">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : catalogs.length === 0 ? (
          <Card>
            <CardContent className="py-20 text-center">
              <FileText className="mx-auto mb-4 h-12 w-12 text-border" />
              <h3 className="mb-2 text-xl font-bold text-foreground">No Catalogs Available</h3>
              <p className="text-muted-foreground">Check back later for our new catalogs.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {catalogs.map((catalog) => (
              <Card key={catalog.id} className="group gap-0 overflow-hidden py-0 transition-colors hover:border-accent">
                <div className="relative aspect-[3/4] overflow-hidden border-b border-border bg-muted">
                  {catalog.cover_image ? (
                    <img
                      src={catalog.cover_image}
                      alt={catalog.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center text-border">
                      <FileText size={64} />
                      <span className="mt-4 text-sm font-bold tracking-widest uppercase">Preview Unavailable</span>
                    </div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a2e]/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <a
                      href={catalog.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(buttonVariants({ variant: "accent", size: "cta" }), "gap-2 rounded-full")}
                    >
                      <Download size={18} />
                      Download PDF
                    </a>
                  </div>
                </div>

                <CardContent className="flex flex-1 flex-col p-6">
                  <h3 className="mb-2 line-clamp-1 text-lg font-bold text-foreground">{catalog.name}</h3>
                  <p className="mb-6 line-clamp-3 flex-1 text-sm text-muted-foreground">
                    {catalog.description || "No description provided."}
                  </p>

                  <a
                    href={catalog.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(buttonVariants({ variant: "outline", size: "cta" }), "mt-auto w-full")}
                  >
                    <FileText size={16} />
                    View Catalog
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </StorefrontLayout>
  );
}
