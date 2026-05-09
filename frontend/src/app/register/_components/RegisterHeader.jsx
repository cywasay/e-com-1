import Link from "next/link";

export default function RegisterHeader() {
  return (
    <>
      <Link href="/" className="mb-8 flex items-center gap-2 text-[#6b6560] hover:text-[#1a1a2e] group">
        <div className="flex items-center justify-center w-6 h-6 rounded-full border border-[#e8e4dc] group-hover:border-[#c8a96e]">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m15 18-6-6 6-6"/></svg>
        </div>
        <span className="text-sm font-bold uppercase tracking-widest">Back to Store</span>
      </Link>
      <div className="flex justify-center mb-6"><Link href="/" className="text-2xl font-bold tracking-tight text-[#1a1a2e]">uniforms<span className="text-[#c8a96e]">.ae</span></Link></div>
      <div className="text-center mb-8"><h1 className="text-2xl font-bold text-[#1a1a2e] tracking-tight mb-2">Create an Account</h1><p className="text-[#6b6560] text-sm">Join uniforms.ae to start ordering</p></div>
    </>
  );
}
