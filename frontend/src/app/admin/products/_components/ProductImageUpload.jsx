"use client";
import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";

export default function ProductImageUpload({ editingId, images, onUpload, onSetPrimary, onDelete, isUploading, isSettingPrimary }) {
  return (
    <div className="pt-6 border-t border-slate-100">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest flex items-center gap-2">
            <ImageIcon size={14} className="text-blue-600" /> Product Images
          </h3>
          <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight">Upload up to 10 images. Click any image to set it as main.</p>
        </div>
      </div>
      <div className="space-y-4">
        <div 
          className={`border-2 border-dashed rounded-md p-8 flex flex-col items-center justify-center transition-colors ${
            !editingId ? 'bg-slate-50 border-slate-200 cursor-not-allowed opacity-60' : 'border-slate-200 hover:border-blue-400 cursor-pointer'
          }`}
          onClick={() => editingId && document.getElementById('image-upload').click()}
        >
          <input 
            id="image-upload" type="file" multiple accept="image/*" className="hidden"
            onChange={(e) => e.target.files?.length > 0 && onUpload(e.target.files)}
          />
          <Upload className={`mb-2 ${isUploading ? 'animate-bounce text-blue-500' : 'text-slate-400'}`} size={24} />
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
            {isUploading ? 'Uploading...' : !editingId ? 'Save product to upload images' : 'Click to upload or drag and drop'}
          </p>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6">
          {images.map((img) => (
            <div 
              key={img.id} 
              className={`relative aspect-square rounded-md border-2 overflow-hidden cursor-pointer group transition-all ${
                img.is_primary ? 'border-green-500 ring-2 ring-green-100' : 'border-slate-200 hover:border-blue-400'
              }`}
              onClick={() => !img.is_primary && onSetPrimary(img.id)}
            >
              <img src={img.full_url} alt="" className="w-full h-full object-cover" />
              {img.is_primary && <div className="absolute top-1 left-1 bg-green-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-widest shadow-sm">Main</div>}
              <button type="button" onClick={(e) => { e.stopPropagation(); onDelete(img.id); }} className="absolute top-1 right-1 bg-white/90 hover:bg-red-500 hover:text-white p-1 rounded-full text-slate-400 transition-colors shadow-sm opacity-0 group-hover:opacity-100"><X size={10} /></button>
              {isSettingPrimary && <div className="absolute inset-0 bg-white/40 flex items-center justify-center"><Loader2 size={16} className="animate-spin text-blue-600" /></div>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
