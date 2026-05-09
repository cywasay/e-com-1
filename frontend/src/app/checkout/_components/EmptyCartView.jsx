import Link from "next/link";

export default function EmptyCartView() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 bg-[#f8f7f4]">
      <h1 className="text-2xl font-bold text-[#1a1a2e]">Your cart is empty</h1>
      <p className="text-[#6b6560]">Add some items before checking out.</p>
      <Link href="/products" className="bg-[#c8a96e] text-[#1a1a2e] px-6 py-2 rounded-lg hover:bg-[#b89b60] transition-colors font-bold uppercase tracking-widest text-sm">
        Browse Products
      </Link>
    </div>
  );
}
