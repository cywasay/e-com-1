"use client";

export default function AssetsSettingsForm({ register }) {
  return (
    <div className="bg-white border border-[#E1E3E5] rounded-sm shadow-sm overflow-hidden">
      <div className="px-8 py-4 bg-gray-50 border-b border-[#E1E3E5]">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Assets & Logos</h3>
      </div>
      <div className="p-8">
        <div className="space-y-2">
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest">Logo URL</label>
          <input {...register("store_logo_url")} className="w-full border border-[#E1E3E5] px-4 py-2.5 text-sm rounded-sm focus:border-[#008060] outline-none" placeholder="URL to your store logo" />
        </div>
      </div>
    </div>
  );
}
