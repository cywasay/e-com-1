"use client";
import { X, Loader2 } from "lucide-react";

export default function CaseStudyModal({ isOpen, onClose, editingCase, onSubmit, isSaving }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{editingCase ? 'Edit Case Study' : 'New Case Study'}</h2>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mt-1">Portfolio & Excellence</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400 hover:text-slate-900"><X size={20} /></button>
        </div>
        
        <form onSubmit={onSubmit} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4 md:col-span-2"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Project Title</label><input name="title" defaultValue={editingCase?.title} required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
            <div className="space-y-4"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Client Name</label><input name="client_name" defaultValue={editingCase?.client_name} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
            <div className="space-y-4"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Industry</label><input name="industry" defaultValue={editingCase?.industry} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
            <div className="space-y-4"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Status</label><select name="status" defaultValue={editingCase?.status || 'draft'} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"><option value="draft">Draft</option><option value="published">Published</option></select></div>
            <div className="space-y-4"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Featured Image URL</label><input name="featured_image" defaultValue={editingCase?.featured_image} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none" /></div>
            <div className="space-y-4 md:col-span-2"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Excerpt</label><textarea name="excerpt" defaultValue={editingCase?.excerpt} rows={2} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none resize-none" /></div>
            <div className="space-y-4 md:col-span-2"><label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Content</label><textarea name="content" defaultValue={editingCase?.content} required rows={10} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-mono text-sm" /></div>
          </div>
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white">
            <button type="button" onClick={onClose} className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">Cancel</button>
            <button type="submit" disabled={isSaving} className="bg-slate-900 hover:bg-blue-600 text-white px-8 py-2.5 rounded-xl font-bold text-xs uppercase tracking-[0.2em] transition-all flex items-center gap-2 disabled:bg-slate-300">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : editingCase ? 'Update' : 'Save Case Study'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
