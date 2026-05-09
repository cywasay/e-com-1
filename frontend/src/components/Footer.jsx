import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#1a1a2e] border-t border-[#ffffff]/10 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/60">
        <p>© {new Date().getFullYear()} uniforms.ae. All rights reserved.</p>
        <div className="flex gap-6">
          <Link href="/contact" className="hover:text-[#c8a96e] transition-colors">Contact</Link>
          <Link href="#" className="hover:text-[#c8a96e] transition-colors">Privacy Policy</Link>
          <Link href="#" className="hover:text-[#c8a96e] transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
}
