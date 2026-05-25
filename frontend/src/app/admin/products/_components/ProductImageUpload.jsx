"use client";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProductImageUpload({ editingId, images, onUpload, onSetPrimary, onDelete, isUploading, isSettingPrimary }) {
  return (
    <div className="pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-foreground uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={14} className="text-accent" /> Product Images
          </h3>
          <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-tight">Upload up to 10 images. Click any image to set it as main.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-colors ${
            !editingId ? "bg-muted border-border cursor-not-allowed opacity-60" : "border-border hover:border-blue-400 cursor-pointer"
          }`}
          onClick={() => editingId && document.getElementById("image-upload").click()}
        >
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) => e.target.files?.length > 0 && onUpload(e.target.files)}
          />
          <Upload className={`mb-2 ${isUploading ? "animate-bounce text-accent" : "text-muted-foreground"}`} size={24} />
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            {isUploading ? "Uploading..." : !editingId ? "Save product to upload images" : "Click to upload or drag and drop"}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {images.map((img) => (
            <div 
              key={img.id} 
              className={`relative aspect-square rounded-md border-2 overflow-hidden cursor-pointer group transition-all ${
                img.is_primary ? "border-green-500 ring-2 ring-green-100" : "border-border hover:border-blue-400"
              }`}
              onClick={() => !img.is_primary && onSetPrimary(img.id)}
            >
              <img src={img.full_url} alt="" className="w-full h-full object-cover" />
              {img.is_primary && (
                <Badge className="absolute top-1 left-1 text-[8px] uppercase tracking-widest bg-green-500 hover:bg-green-500">
                  Main
                </Badge>
              )}
              <Button
                type="button"
                variant="secondary"
                size="icon-xs"
                onClick={(e) => { e.stopPropagation(); onDelete(img.id); }}
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 hover:bg-red-500 hover:text-white"
              >
                <X size={10} />
              </Button>
              {isSettingPrimary && (
                <div className="absolute inset-0 bg-white/40 flex items-center justify-center">
                  <Loader2 size={16} className="animate-spin text-accent" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
