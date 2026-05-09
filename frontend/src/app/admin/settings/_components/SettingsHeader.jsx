import { Save, Loader2 } from "lucide-react";

export default function SettingsHeader({ onSave, isPending, isDirty }) {
  return (
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Store Settings</h1>
      <button
        onClick={onSave}
        disabled={isPending || !isDirty}
        className="flex items-center gap-2 bg-[#008060] text-white px-6 py-2.5 rounded-sm font-bold text-xs uppercase tracking-widest hover:bg-[#006e52] transition-all disabled:opacity-50 shadow-sm"
      >
        {isPending ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
        Save All Changes
      </button>
    </div>
  );
}
