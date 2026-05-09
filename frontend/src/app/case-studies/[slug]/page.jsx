"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Building2, Loader2, Share2, Briefcase, CheckCircle2, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: item, isLoading, error } = useQuery({
    queryKey: ["case-study", slug],
    queryFn: async () => {
      const response = await api.get(`/case-studies/${slug}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f4]">
        <Loader2 className="w-12 h-12 animate-spin text-[#c8a96e] mb-4" />
        <p className="text-[#1a1a2e] font-medium">Retrieving Success Story...</p>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f8f7f4]">
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">Content Not Found</h1>
        <p className="text-[#6b6560] mb-8 max-w-md">The success story you are looking for is currently unavailable.</p>
        <button 
          onClick={() => router.push("/case-studies")}
          className="bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-md font-semibold hover:bg-[#b89b60] transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar dark={false} />

      <main className="max-w-5xl mx-auto px-6 py-16">
        <button 
          onClick={() => router.push("/case-studies")}
          className="flex items-center gap-2 text-[#6b6560] hover:text-[#1a1a2e] font-bold uppercase tracking-widest text-[10px] mb-12 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Case Studies
        </button>

        <header className="space-y-6 mb-12">
          <div className="flex items-center gap-4">
            {item.industry && (
              <span className="px-3 py-1 bg-white text-[#1a1a2e] text-[10px] font-bold uppercase tracking-widest rounded border border-[#e8e4dc]">
                {item.industry}
              </span>
            )}
            <span className="text-[#6b6560] text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
              Success Story
            </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] tracking-tight leading-tight">
            {item.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-[#e8e4dc]">
            <div>
              <p className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest mb-1">Client</p>
              <p className="text-[#1a1a2e] font-bold flex items-center gap-2">
                <Building2 size={16} className="text-[#c8a96e]" />
                {item.client_name || 'Confidential'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest mb-1">Impact</p>
              <p className="text-[#2d7a4f] font-bold flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#2d7a4f]" />
                Strategic Transformation
              </p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest mb-1">Sector</p>
              <p className="text-[#1a1a2e] font-bold">{item.industry || 'Corporate'}</p>
            </div>
          </div>
        </header>

        {item.featured_image && (
          <div className="aspect-[21/9] rounded-lg overflow-hidden mb-12 border border-[#e8e4dc]">
            <img src={item.featured_image} alt={item.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-8">
            <div className="prose prose-slate prose-lg max-w-none 
              prose-headings:text-[#1a1a2e] prose-headings:font-bold prose-headings:tracking-tight
              prose-p:text-[#6b6560] prose-p:leading-relaxed
              prose-a:text-[#c8a96e] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#1a1a2e] prose-strong:font-bold
              prose-img:rounded-lg prose-img:border prose-img:border-[#e8e4dc]
              prose-blockquote:border-l-4 prose-blockquote:border-[#c8a96e] prose-blockquote:bg-white prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-r-lg"
            >
              <div dangerouslySetInnerHTML={{ __html: item.content.replace(/\n/g, '<br />') }} />
            </div>
            
            <div className="mt-16 pt-8 border-t border-[#e8e4dc] flex items-center gap-4">
              <Tag size={16} className="text-[#e8e4dc]" />
              <span className="px-3 py-1 bg-white text-[#6b6560] border border-[#e8e4dc] text-[10px] font-bold uppercase tracking-widest rounded">
                {item.industry || 'Case Analysis'}
              </span>
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-8">
            <div className="p-6 bg-white rounded-lg border border-[#e8e4dc]">
              <h3 className="text-sm font-bold text-[#1a1a2e] uppercase tracking-widest mb-4 flex items-center gap-2">
                <Briefcase size={16} className="text-[#c8a96e]" />
                Service Scope
              </h3>
              <ul className="space-y-3">
                {['Strategic Design', 'Material Science', 'Scale Logistics', 'Brand Consistency'].map((p, i) => (
                  <li key={i} className="text-sm text-[#6b6560] flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-[#c8a96e]" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between p-4 border border-[#e8e4dc] rounded-lg bg-white">
              <span className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Share Impact</span>
              <button className="p-2 text-[#6b6560] hover:text-[#c8a96e] transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
