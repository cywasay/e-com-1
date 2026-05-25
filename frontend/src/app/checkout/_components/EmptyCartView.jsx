import Link from "next/link";
import StorefrontLayout from "@/components/StorefrontLayout";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function EmptyCartView() {
  return (
    <StorefrontLayout>
      <div className="page-container-narrow flex flex-col items-center justify-center space-y-4 py-20 text-center">
        <h1 className="section-heading">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some items before checking out.</p>
        <Link href="/products" className={cn(buttonVariants({ variant: "accent", size: "cta" }))}>
          Browse Products
        </Link>
      </div>
    </StorefrontLayout>
  );
}
