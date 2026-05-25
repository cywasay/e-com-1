"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function AdminFormSkeleton({ sections = 2, fields = 4 }) {
  return (
    <div className="space-y-8">
      {[...Array(sections)].map((_, sectionIndex) => (
        <Card key={sectionIndex} className="shadow-sm">
          <CardContent className="space-y-6 p-6">
            <Skeleton className="h-4 w-32" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {[...Array(fields)].map((_, fieldIndex) => (
                <div key={fieldIndex} className="space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
