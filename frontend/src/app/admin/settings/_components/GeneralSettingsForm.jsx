"use client";

export default function GeneralSettingsForm({ register }) {
  return (
    <div className="bg-white border border-[#E1E3E5] rounded-sm shadow-sm overflow-hidden">
      <div className="px-8 py-4 bg-gray-50 border-b border-[#E1E3E5]">
        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">General Information</h3>
      </div>
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        <Field label="Store Name" {...register("store_name")} placeholder="uniforms.ae" />
        <Field label="Support Email" {...register("store_email")} placeholder="help@uniforms.ae" />
        <Field label="Store Phone" {...register("store_phone")} placeholder="+971..." />
        <Field label="WhatsApp" {...register("store_whatsapp")} placeholder="+971..." />
        <div className="md:col-span-2 space-y-2">
          <label className="block text-[11px] font-black text-gray-500 uppercase tracking-widest">Store Address</label>
          <textarea {...register("store_address")} rows={3} className="w-full border border-[#E1E3E5] px-4 py-2.5 text-sm rounded-sm focus:border-[#008060] outline-none resize-none" placeholder="Physical address..." />
        </div>
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
