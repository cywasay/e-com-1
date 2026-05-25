"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const adminFilterTabListClass =
  "h-auto w-full justify-start gap-6 rounded-none border-b border-border bg-transparent p-0 sm:gap-8";

export const adminFilterTabTriggerClass =
  "rounded-none px-1 pb-4 pt-1 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground data-active:text-accent data-active:after:bg-accent";

export default function AdminFilterTabs({ value, onValueChange, tabs, className }) {
  return (
    <Tabs value={value} onValueChange={onValueChange} className={className}>
      <TabsList variant="line" className={adminFilterTabListClass}>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={adminFilterTabTriggerClass}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
