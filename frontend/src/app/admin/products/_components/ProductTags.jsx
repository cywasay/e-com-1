"use client";
export default function ProductTags({ formData, setFormData }) {
  const tags = [
    { key: 'is_featured', label: 'Featured' },
    { key: 'is_bestseller', label: 'Bestseller' },
    { key: 'is_eco_friendly', label: 'Eco Friendly' },
    { key: 'is_new_arrival', label: 'New Arrival' }
  ];

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Product Tags</label>
      <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-md">
        {tags.map(tag => (
          <label key={tag.key} className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox"
              checked={formData[tag.key]}
              onChange={(e) => setFormData({...formData, [tag.key]: e.target.checked})}
              className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900 transition-colors">{tag.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
