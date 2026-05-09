"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Link from "next/link";
import { Calendar, User, ArrowRight, BookOpen, Loader2 } from "lucide-react";
import { format } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function BlogClient({ initialPosts }) {
  const { data: postsData, isLoading } = useQuery({
    queryKey: ["public-blog"],
    queryFn: async () => {
      const response = await api.get("/blog");
      return response.data;
    },
    initialData: initialPosts ? { data: initialPosts } : undefined
  });

  const posts = postsData?.data || initialPosts || [];

  return (
    <div className="min-h-screen bg-[#f8f7f4] font-sans text-[#1a1a2e]">
      <Navbar dark={false} />

      {/* Hero Section */}
      <section className="bg-[#1a1a2e] py-24 border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">
            Insights & Industry News
          </h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium leading-relaxed">
            Exploring the intersection of technology, textile engineering, and corporate identity.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-20">
        {isLoading && !initialPosts ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 animate-spin text-[#c8a96e] mb-4" />
            <p className="text-[#1a1a2e] font-medium">Loading Archive...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6b6560]">No stories found in the archive yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post.id} className="group bg-white border border-[#e8e4dc] rounded-lg overflow-hidden hover:border-[#c8a96e] transition-colors">
                <Link href={`/blog/${post.slug}`} className="block">
                  <div className="aspect-[16/10] bg-[#f8f7f4] relative overflow-hidden">
                    {post.featured_image ? (
                      <img 
                        src={post.featured_image} 
                        alt={post.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#e8e4dc]">
                        <BookOpen size={48} />
                      </div>
                    )}
                    {post.category_tag && (
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 rounded bg-white text-[#1a1a2e] text-[10px] font-bold uppercase tracking-wider shadow-sm border border-[#e8e4dc]">
                          {post.category_tag}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-4 text-xs font-medium text-[#6b6560] uppercase tracking-widest">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} />
                        {post.created_at ? format(new Date(post.created_at), "MMM d, yyyy") : ""}
                      </span>
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {post.author?.name}
                      </span>
                    </div>
                    
                    <h2 className="text-xl font-bold text-[#1a1a2e] group-hover:text-[#c8a96e] transition-colors line-clamp-2 leading-tight">
                      {post.title}
                    </h2>
                    
                    <p className="text-[#6b6560] line-clamp-3 text-sm leading-relaxed">
                      {post.excerpt || (post.content && post.content.substring(0, 160).replace(/[#*`]/g, '') + '...')}
                    </p>
                    
                    <div className="pt-2 flex items-center gap-2 text-[#c8a96e] font-bold text-xs uppercase tracking-widest group-hover:gap-3 transition-all">
                      Read Article
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {postsData?.last_page > 1 && (
          <div className="mt-16 pt-10 border-t border-[#e8e4dc] flex justify-center gap-2">
            {[...Array(postsData.last_page)].map((_, i) => (
              <button 
                key={i}
                className={`w-10 h-10 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                  postsData.current_page === i + 1 
                    ? 'bg-[#c8a96e] text-[#1a1a2e]' 
                    : 'bg-white border border-[#e8e4dc] text-[#6b6560] hover:bg-[#f8f7f4] hover:text-[#1a1a2e]'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
