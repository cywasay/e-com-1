"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import api from "@/lib/api";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function flattenCategories(categories, depth = 0, acc = []) {
  categories.forEach((category) => {
    acc.push({ ...category, depth });
    if (category.children_recursive?.length) {
      flattenCategories(category.children_recursive, depth + 1, acc);
    }
  });
  return acc;
}

export default function NavCategoriesMenu() {
  const { data: categories = [] } = useQuery({
    queryKey: ["public", "categories", "nav"],
    queryFn: async () => {
      const response = await api.get("/categories");
      return response.data.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const flatCategories = flattenCategories(categories);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 transition-colors outline-none hover:text-[#c8a96e] data-popup-open:text-[#c8a96e]">
        Products
        <ChevronDown size={14} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Browse by category</DropdownMenuLabel>
          <DropdownMenuItem nativeButton={false} render={<Link href="/products" />}>
            All products
          </DropdownMenuItem>
          {flatCategories.length > 0 && <DropdownMenuSeparator />}
          {flatCategories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              nativeButton={false}
              className={category.depth > 0 ? "pl-6" : undefined}
              render={<Link href={`/categories/${category.slug}`} />}
            >
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
