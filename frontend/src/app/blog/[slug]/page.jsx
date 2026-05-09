"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import { useParams, useRouter } from "next/navigation";
import { Calendar, User, ArrowLeft, Share2, BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogPostDetail() {
  const { slug } = useParams();
  const router = useRouter();

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", slug],
    queryFn: async () => {
      const response = await api.get(`/blog/${slug}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8f7f4]">
        <Loader2 className="w-12 h-12 animate-spin text-[#c8a96e] mb-4" />
        <p className="text-[#1a1a2e] font-medium">Retrieving Story...</p>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-[#f8f7f4]">
        <h1 className="text-3xl font-bold text-[#1a1a2e] mb-4">Post Not Found</h1>
        <p className="text-[#6b6560] mb-8 max-w-md">The article you are looking for might have been moved or archived.</p>
        <button 
          onClick={() => router.push("/blog")}
          className="bg-[#c8a96e] text-[#1a1a2e] px-8 py-3 rounded-md font-semibold hover:bg-[#b89b60] transition-colors inline-flex items-center gap-2"
        >
          <ArrowLeft size={18} />
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar dark={false} />

      <main className="max-w-4xl mx-auto px-6 py-16">
        <button 
          onClick={() => router.push("/blog")}
          className="flex items-center gap-2 text-[#6b6560] hover:text-[#1a1a2e] font-bold uppercase tracking-widest text-[10px] mb-12 transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Archive
        </button>

        <header className="space-y-6 mb-12">
          {post.category_tag && (
            <span className="inline-block px-3 py-1 rounded bg-white text-[#1a1a2e] text-[10px] font-bold uppercase tracking-widest border border-[#e8e4dc]">
              {post.category_tag}
            </span>
          )}
          
          <h1 className="text-4xl md:text-5xl font-bold text-[#1a1a2e] tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 pt-6 text-xs font-semibold text-[#6b6560] uppercase tracking-widest border-t border-[#e8e4dc]">
            <div className="flex items-center gap-2">
              <User size={14} className="text-[#c8a96e]" />
              <span>{post.author?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-[#c8a96e]" />
              <span>{format(new Date(post.created_at), "MMMM d, yyyy")}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={14} className="text-[#c8a96e]" />
              <span>{Math.ceil(post.content.split(' ').length / 200)} min read</span>
            </div>
          </div>
        </header>

        {post.featured_image && (
          <div className="aspect-[21/9] rounded-lg overflow-hidden mb-12 border border-[#e8e4dc]">
            <img src={post.featured_image} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="prose prose-slate prose-lg max-w-none 
          prose-headings:text-[#1a1a2e] prose-headings:font-bold prose-headings:tracking-tight
          prose-p:text-[#6b6560] prose-p:leading-relaxed
          prose-a:text-[#c8a96e] prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-strong:text-[#1a1a2e] prose-strong:font-bold
          prose-img:rounded-lg prose-img:border prose-img:border-[#e8e4dc]
          prose-blockquote:border-l-4 prose-blockquote:border-[#c8a96e] prose-blockquote:bg-white prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-lg"
        >
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br />') }} />
        </div>

        <div className="mt-16 pt-8 border-t border-[#e8e4dc] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-[#6b6560] uppercase tracking-widest">Share this story:</span>
            <button className="p-2 text-[#6b6560] hover:text-[#c8a96e] transition-colors">
              <Share2 size={18} />
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
