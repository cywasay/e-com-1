"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function AdminTableSkeleton({
  rows = 6,
  columns = 5,
  showSearch = false,
  showHeader = true,
  className,
}) {
  return (
    <Card className={cn("overflow-hidden py-0 shadow-sm", className)}>
      {showSearch && (
        <div className="border-b border-border bg-muted/50 p-4">
          <Skeleton className="h-10 w-full max-w-md" />
        </div>
      )}
      <Table>
        {showHeader && (
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              {[...Array(columns)].map((_, i) => (
                <TableHead key={i}>
                  <Skeleton className="h-3 w-16" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {[...Array(rows)].map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {[...Array(columns)].map((_, colIndex) => (
                <TableCell key={colIndex}>
                  {colIndex === 0 ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-36" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  ) : colIndex === columns - 1 ? (
                    <Skeleton className="ml-auto h-8 w-16" />
                  ) : (
                    <Skeleton className="h-4 w-20" />
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
