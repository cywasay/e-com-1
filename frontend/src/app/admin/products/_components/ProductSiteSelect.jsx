"use client";
export default function ProductSiteSelect({ sites, selectedSiteIds, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Publish to Sites</label>
      <div className="grid grid-cols-1 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-md">
        {sites.length === 0 ? (
          <p className="text-[10px] text-slate-400 italic">No sites available</p>
        ) : (
          sites.map(site => (
            <label key={site.id} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="checkbox"
                checked={selectedSiteIds.includes(site.id)}
                onChange={(e) => {
                  const newSiteIds = e.target.checked 
                    ? [...selectedSiteIds, site.id]
                    : selectedSiteIds.filter(id => id !== site.id);
                  onChange(newSiteIds);
                }}
                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700 group-hover:text-slate-900 transition-colors">{site.name}</span>
                <span className="text-[9px] text-slate-400 font-mono tracking-tight">{site.domain}</span>
              </div>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
