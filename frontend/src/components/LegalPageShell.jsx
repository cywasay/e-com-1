import StorefrontLayout from "./StorefrontLayout";

export default function LegalPageShell({ title, children }) {
  return (
    <StorefrontLayout>
      <section className="bg-[#1a1a2e] py-16 border-b border-white/10">
        <div className="max-w-3xl mx-auto px-6">
          <p className="text-xs font-bold uppercase tracking-widest text-[#c8a96e] mb-3">
            Legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            {title}
          </h1>
        </div>
      </section>
      <article className="max-w-3xl mx-auto px-6 py-12 prose prose-slate prose-headings:text-[#1a1a2e] prose-p:text-[#6b6560]">
        {children}
      </article>
    </StorefrontLayout>
  );
}
