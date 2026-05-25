"use client";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PriceSetList({ priceSets, isLoading, selectedSetId, onSelect }) {
  return (
    <div className="space-y-4">
      <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Available Price Sets</h4>
      <Card className="overflow-hidden py-0 shadow-sm divide-y divide-gray-100">
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          priceSets?.map((set) => (
            <Button
              key={set.id}
              variant="ghost"
              onClick={() => onSelect(set.id)}
              className={`w-full h-auto text-left p-4 justify-between rounded-none hover:bg-gray-50 ${
                selectedSetId === set.id ? "bg-accent/10 border-l-2 border-accent" : ""
              }`}
            >
              <div>
                <p className="text-sm font-bold text-foreground">{set.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={set.type === "global_sale" ? "secondary" : "outline"} className="text-[8px] uppercase tracking-widest">
                    {set.type.replace("_", " ")}
                  </Badge>
                  <span className="text-[10px] text-gray-400 font-medium">{set.items_count} items</span>
                </div>
              </div>
              <ChevronRight size={14} className={selectedSetId === set.id ? "translate-x-1 text-accent" : "text-gray-300"} />
            </Button>
          ))
        )}
      </Card>
    </div>
  );
}

function LoadingSkeleton() {
  return [...Array(3)].map((_, i) => (
    <div key={i} className="p-4">
      <Skeleton className="h-4 w-32 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  ));
}
