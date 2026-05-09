"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Download, Loader2 } from "lucide-react";

export default function CatalogsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["catalogs", "public"],
    queryFn: async () => {
      const res = await api.get("/catalogs");
      return res.data.data;
    },
  });

  return (
    <div className="min-h-screen bg-[#f8f7f4] flex flex-col font-sans text-[#1a1a2e]">
      <Navbar />

      {/* Hero Section */}
      <div className="bg-[#1a1a2e] text-white py-16 md:py-24 border-b border-[#ffffff]/10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            Product <span className="text-[#c8a96e]">Catalogs</span>
          </h1>
          <p className="text-white/80 max-w-2xl mx-auto text-lg">
            Download our latest product catalogs and collections.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-16">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-[#c8a96e]" />
          </div>
        ) : !data || data.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-[#e8e4dc]">
            <FileText className="w-12 h-12 text-[#e8e4dc] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1a1a2e] mb-2">No Catalogs Available</h3>
            <p className="text-[#6b6560]">Check back later for our new catalogs.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.map((catalog) => (
              <div
                key={catalog.id}
                className="bg-white rounded-xl overflow-hidden border border-[#e8e4dc] hover:border-[#c8a96e] transition-colors shadow-sm flex flex-col group"
              >
                <div className="aspect-[3/4] bg-[#f8f7f4] relative overflow-hidden border-b border-[#e8e4dc]">
                  {catalog.cover_image ? (
                    <img
                      src={catalog.cover_image}
                      alt={catalog.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-[#e8e4dc]">
                      <FileText size={64} />
                      <span className="mt-4 font-bold tracking-widest uppercase text-sm">Preview Unavailable</span>
                    </div>
                  )}
                  {/* Overlay for quick action */}
                  <div className="absolute inset-0 bg-[#1a1a2e]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <a
                      href={catalog.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#c8a96e] text-[#1a1a2e] px-6 py-3 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-[#b89b60] transition-colors flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 duration-300"
                    >
                      <Download size={18} />
                      Download PDF
                    </a>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-[#1a1a2e] mb-2 line-clamp-1">{catalog.name}</h3>
                  <p className="text-[#6b6560] text-sm mb-6 flex-1 line-clamp-3">
                    {catalog.description || "No description provided."}
                  </p>
                  
                  <a
                    href={catalog.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full border border-[#e8e4dc] bg-[#f8f7f4] text-[#1a1a2e] py-3 rounded-lg font-bold uppercase tracking-widest text-xs hover:border-[#c8a96e] hover:text-[#c8a96e] transition-all flex items-center justify-center gap-2"
                  >
                    <FileText size={16} />
                    View Catalog
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
