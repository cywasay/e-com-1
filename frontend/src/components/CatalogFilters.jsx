"use client";

import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

function formatCategoryLabel(name) {
  if (!name) return "";
  return name
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function FilterSection({ title, children }) {
  return (
    <div className="space-y-3">
      <h4 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </h4>
      {children}
    </div>
  );
}

function FilterOption({ selected, onSelect, label, depth = 0 }) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onSelect}
      className={`h-auto w-full justify-start gap-3 rounded-md py-2 pr-2 text-left font-normal ${
        selected
          ? "bg-primary/5 text-foreground hover:bg-primary/5"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      style={{ paddingLeft: `${12 + depth * 16}px` }}
    >
      <span
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          selected
            ? "border-primary bg-primary"
            : "border-border bg-white"
        }`}
        aria-hidden
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span className={`text-sm leading-tight ${selected ? "font-semibold text-foreground" : "font-medium"}`}>
        {label}
      </span>
    </Button>
  );
}

function CategoryTree({ items, categoryId, onSelect, depth = 0 }) {
  return items.map((cat) => {
    const id = cat.id.toString();
    const selected = categoryId === id;
    const hasChildren = cat.children_recursive?.length > 0;

    return (
      <div key={cat.id}>
        <FilterOption
          selected={selected}
          onSelect={() => onSelect(selected ? "" : id)}
          label={formatCategoryLabel(cat.name)}
          depth={depth}
        />
        {hasChildren && (
          <div className={depth === 0 ? "ml-3 border-l border-border pl-1" : "ml-3 border-l border-border/60 pl-1"}>
            <CategoryTree
              items={cat.children_recursive}
              categoryId={categoryId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          </div>
        )}
      </div>
    );
  });
}

export default function CatalogFilters({
  categories = [],
  categoryId,
  onCategoryChange,
  availability,
  onAvailabilityChange,
  onClear,
  hasActiveFilters = false,
  isLoading = false,
  embedded = false,
  className = "",
}) {
  const inStockOnly = availability === "in_stock";

  const content = (
    <div className={`space-y-6 ${embedded ? "p-0" : ""}`}>
      <FilterSection title="Category">
        {isLoading ? (
          <div className="flex h-24 items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-border" />
          </div>
        ) : categories.length > 0 ? (
          <ScrollArea className="max-h-[320px] pr-1">
            <div className="space-y-0.5">
              <FilterOption
                selected={!categoryId}
                onSelect={() => onCategoryChange("")}
                label="All categories"
                depth={0}
              />
              <CategoryTree
                items={categories}
                categoryId={categoryId}
                onSelect={onCategoryChange}
              />
            </div>
          </ScrollArea>
        ) : (
          <p className="py-2 text-sm text-muted-foreground">No categories available.</p>
        )}
      </FilterSection>

      <Separator />

      <FilterSection title="Availability">
        <div className="flex items-center gap-3 rounded-md py-1">
          <Checkbox
            id="in-stock-only"
            checked={inStockOnly}
            onCheckedChange={(checked) =>
              onAvailabilityChange(checked ? "in_stock" : "all")
            }
          />
          <Label htmlFor="in-stock-only" className="cursor-pointer font-medium">
            In stock only
          </Label>
        </div>
      </FilterSection>
    </div>
  );

  if (embedded) {
    return <div className={className}>{content}</div>;
  }

  return (
    <Card className={`shadow-sm ${className}`}>
      <CardHeader className="flex-row items-center justify-between border-b pb-4">
        <div>
          <CardTitle className="text-sm font-bold">Refine results</CardTitle>
          <CardDescription className="mt-0.5">Narrow the catalog</CardDescription>
        </div>
        {hasActiveFilters && onClear && (
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={onClear}
            className="gap-1 text-[11px] font-bold uppercase tracking-widest text-accent hover:text-foreground"
          >
            <X size={12} />
            Clear
          </Button>
        )}
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
