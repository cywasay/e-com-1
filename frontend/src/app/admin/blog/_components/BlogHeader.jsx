import { Plus } from "lucide-react";

export default function BlogHeader({ onCreate }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Blog Posts</h1>
        <p className="text-sm text-slate-500">Manage your store's blog content and announcements.</p>
      </div>
      <button 
        onClick={onCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm"
      >
        <Plus size={18} />
        Create Post
      </button>
    </div>
  );
}
