"use client";
export default function ProductBasicInfo({ formData, setFormData, categoryOptions }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Product Name</label>
        <input 
          required
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors"
          placeholder="e.g., Premium Cotton Lab Coat"
        />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Category</label>
        <select 
          value={formData.category_id}
          onChange={(e) => setFormData({...formData, category_id: e.target.value})}
          className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="">Uncategorized</option>
          {categoryOptions.map(opt => (
            <option key={opt.id} value={opt.id}>{opt.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Price (AED)</label>
          <input 
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="0.00"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Status</label>
          <select 
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Visibility</label>
        <select 
          value={formData.visibility}
          onChange={(e) => setFormData({...formData, visibility: e.target.value})}
          className="w-full bg-white border border-slate-200 px-4 py-2.5 text-sm rounded focus:outline-none focus:border-blue-500 transition-colors"
        >
          <option value="both">Both (B2B & B2C)</option>
          <option value="b2c_only">B2C Only</option>
          <option value="b2b_only">B2B Only</option>
        </select>
      </div>
    </div>
  );
}
