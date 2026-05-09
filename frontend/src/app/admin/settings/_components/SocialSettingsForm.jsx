"use client";

export default function SocialSettingsForm({ register }) {
  return (
    <div className="bg-white border border-[#E1E3E5] rounded-sm shadow-sm overflow-hidden">
      <div className="px-8 py-4 bg-gray-50 border-b border-[#E1E3E5]">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Social Media Links</h3>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Facebook" {...register("facebook_url")} placeholder="https://..." />
        <Field label="Instagram" {...register("instagram_url")} placeholder="https://..." />
        <Field label="Twitter" {...register("twitter_url")} placeholder="https://..." />
        <Field label="LinkedIn" {...register("linkedin_url")} placeholder="https://..." />
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div className="space-y-2">
      <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest">{label}</label>
      <input {...props} className="w-full border border-[#E1E3E5] px-4 py-2.5 text-sm rounded-sm focus:border-[#008060] outline-none" />
    </div>
  );
}
