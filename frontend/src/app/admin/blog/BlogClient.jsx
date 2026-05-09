"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import BlogHeader from "./_components/BlogHeader";
import BlogTable from "./_components/BlogTable";
import BlogPostModal from "./_components/BlogPostModal";

export default function BlogClient() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const queryClient = useQueryClient();

  const { data: postsData, isLoading } = useQuery({
    queryKey: ["admin-blog"],
    queryFn: () => api.get("/admin/blog").then(res => res.data),
  });

  const mutation = useMutation({
    mutationFn: (data) => editingPost ? api.put(`/admin/blog/${editingPost.id}`, data) : api.post("/admin/blog", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-blog"]);
      setIsModalOpen(false);
      setEditingPost(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/admin/blog/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["admin-blog"])
  });

  const filteredPosts = postsData?.data?.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6">
      <BlogHeader onCreate={() => { setEditingPost(null); setIsModalOpen(true); }} />
      
      <BlogTable 
        posts={filteredPosts} 
        isLoading={isLoading} 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        onEdit={(post) => { setEditingPost(post); setIsModalOpen(true); }}
        onDelete={(id) => confirm("Delete?") && deleteMutation.mutate(id)}
      />

      <BlogPostModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        editingPost={editingPost}
        onSubmit={(e) => { e.preventDefault(); const fd = new FormData(e.target); mutation.mutate(Object.fromEntries(fd.entries())); }}
        isSaving={mutation.isPending}
      />

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
}
